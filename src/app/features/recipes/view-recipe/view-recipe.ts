import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RecipesService } from '../../../services/recipes.service';
import { Recipe, RecipeResponse } from '../../../models/recipe.model';
import { UserContextService } from '../../../services/user-context.service';
import { TranslationService } from '../../../services/translation.service';
import { TtsSocketService } from '../../../services/tts-socket.service';

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './view-recipe.html',
  styleUrl: './view-recipe.css'
})
export class ViewRecipe implements OnInit {
  protected userId = '';
  protected recipeId = '';
  protected recipe!: Recipe;
  protected isLoading = false;
  protected error: string | null = null;
  protected queryParams = {};
  protected targetLang = 'en'; // default to  english 
  protected readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'it', label: 'Italian' },
    { code: 'zh', label: 'Chinese (Simplified)' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'ms', label: 'Malay' },
  ];
  protected translatedRecipe: { title: string; instructions: string; ingredients: string[]; lang: string } | null = null;
  protected isTranslating = false;
  protected translationError: string | null = null;
  protected isTtsLoading = false;
  protected ttsError: string | null = null;
  protected isPlaying = false;
  protected playbackStatus: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipes = inject(RecipesService);
  private readonly userContext = inject(UserContextService);
  private readonly translationService = inject(TranslationService);
  private readonly ttsSocket = inject(TtsSocketService);

  private ttsSubscription: any;
  private audio: any; // audio element for TTS playback
  private audioUrl: string | null = null;

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.queryParamMap.get('recipeId') || '';

    this.userId = this.userContext.getUserId() || '';
    this.queryParams = { userId: this.userId };
    this.subscribeToTts();

    if (!this.recipeId) {
      this.router.navigate(['/recipes-34076352'], { queryParams: this.queryParams });
      return;
    }

    if (!this.userId) {
      this.error = 'User information is unavailable.';
      return;
    }

    // Update the URL to include recipeId in query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.queryParams, recipeId: this.recipeId },
      replaceUrl: true,
    });

    this.loadRecipe();
  }

  protected goBack(): void {
    this.router.navigate(['/recipes-34076352'], { queryParams: this.queryParams });
  }

  // Translate the recipe
  protected translateRecipe(): void {
    if (!this.recipe || !this.userId) {
      return;
    }

    this.isTranslating = true;
    this.translationError = null;
    this.translatedRecipe = null;

    const payload = {
      title: this.recipe.title,
      instructions: (this.recipe.instructions || []).join('\n'),
      ingredients: this.recipe.ingredients || [],
      targetLang: this.targetLang,
    };

    this.translationService.analyzeTranslation(this.userId, payload).subscribe({
      next: (response) => {
        this.isTranslating = false;
        this.translatedRecipe = response;
      },
      error: (err) => {
        this.isTranslating = false;
        this.translationError = err.error?.error || 'Unable to translate recipe.';
      },
    });
  }

  // text to speech 
  protected handleTts(): void {
    if (!this.recipe || !this.userId) {
      this.ttsError = 'Recipe not ready for playback.';
      return;
    }

    // Prevent multiple requests
    if (this.isTtsLoading) {
      return;
    }

    if (this.audio && this.audioUrl) {
      // Toggle playback
      if (this.isPlaying) {
        this.audio.pause();
      }
      return;
    }

    const instructionText = (this.recipe.instructions || []).join('\n').trim();

    // Reset TTS state
    this.ttsError = null;
    this.isTtsLoading = true;
    this.isPlaying = false;
    this.playbackStatus = 'Loading…';
    this.audioUrl = null;
    this.ensureAudio();
    this.ttsSocket.requestTts(instructionText, this.userId, this.recipeId);
  }

  private loadRecipe(): void {
    this.isLoading = true;
    this.error = null;

    this.recipes.getById(this.recipeId, this.userId).subscribe({
      next: (response: RecipeResponse) => {
        this.isLoading = false;

        // set the recipe data 
        this.recipe = response.item;
        if (!this.recipe) {
          this.error = 'Recipe not found.';
        } else {
          // Reset translation and TTS state
          this.translatedRecipe = null;
          this.translationError = null;
          this.ttsError = null;
          this.resetAudio();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Unable to load recipe.';
      },
    });
  }

  // Subscribe to TTS results
  private subscribeToTts(): void {
    if (this.ttsSubscription) {
      return;
    }

    this.ttsSocket.connect();
    this.ttsSocket.onResult((payload: any) => {
      this.isTtsLoading = false;

      if (!payload || payload.error || !payload.url) {
        this.ttsError = payload?.error || 'TTS unavailable';
        this.playbackStatus = 'Paused';
        this.isPlaying = false;
        return;
      }
      
      // Play the received audio URL
      this.ttsError = null;
      const audio = this.ensureAudio();
      this.audioUrl = payload.url;
      audio.src = payload.url;
      audio.currentTime = 0;

      const play = audio.play();
      if (play) {
        play
          .then(() => {
            this.isPlaying = true;
            this.playbackStatus = 'Playing…';
          })
          .catch(() => {
            this.ttsError = 'TTS unavailable';
            this.isPlaying = false;
            this.playbackStatus = 'Paused';
          });
      }
    });
  }

  // Ensure audio element is created (end, pause, play events)
  private ensureAudio() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.playbackStatus = 'Paused';
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.playbackStatus = 'Paused';
      });
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.playbackStatus = 'Playing…';
      });
    }

    return this.audio;
  }

  // Reset audio state
  private resetAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
    this.audioUrl = null;
    this.isPlaying = false;
    this.playbackStatus = null;
  }
}
