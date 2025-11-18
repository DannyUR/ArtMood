<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EmotionController;
use App\Http\Controllers\NotificationController;

// ----------------------------------------------------
// RUTAS PÚBLICAS (SIN TOKEN)
// ----------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ----------------------------------------------------
// RUTAS PROTEGIDAS POR JWT (require Bearer Token)
// ----------------------------------------------------
Route::middleware(['jwt.verify'])->group(function () {

    // ---------- AUTH ----------
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // ---------- USERS ----------
    Route::get('/users',          [UserController::class, 'index']);
    Route::post('/users',         [UserController::class, 'store']);
    Route::get('/users/{id}',     [UserController::class, 'show']);
    Route::put('/users/{id}',     [UserController::class, 'update']);
    Route::delete('/users/{id}',  [UserController::class, 'destroy']);

    // ---------- WORKS ----------
    Route::get('/works',            [WorkController::class, 'index']);
    Route::post('/works',           [WorkController::class, 'store']);
    Route::get('/works/{id}',       [WorkController::class, 'show']);
    Route::put('/works/{id}',       [WorkController::class, 'update']);
    Route::delete('/works/{id}',    [WorkController::class, 'destroy']);

    // ---------- COMMENTS ----------
    Route::get('/works/{id}/comments', [CommentController::class, 'index']);
    Route::post('/comments',           [CommentController::class, 'store']);
    Route::delete('/comments/{id}',    [CommentController::class, 'destroy']);

    // ---------- REACTIONS ----------
    Route::get('/works/{id}/reactions', [ReactionController::class, 'index']);
    Route::post('/reactions',           [ReactionController::class, 'store']);
    Route::delete('/reactions/{id}',    [ReactionController::class, 'destroy']);

    // ---------- FOLLOWERS ----------
    Route::post('/follow/{id}',         [FollowerController::class, 'follow']);
    Route::delete('/unfollow/{id}',     [FollowerController::class, 'unfollow']);
    Route::get('/followers/{id}',       [FollowerController::class, 'followers']);
    Route::get('/following/{id}',       [FollowerController::class, 'following']);

    // ---------- CATEGORIES ----------
    Route::get('/categories',           [CategoryController::class, 'index']);
    Route::post('/categories',          [CategoryController::class, 'store']);
    Route::put('/categories/{id}',      [CategoryController::class, 'update']);
    Route::delete('/categories/{id}',   [CategoryController::class, 'destroy']);

    // ---------- EMOTIONS ----------
    Route::get('/emotions',              [EmotionController::class, 'index']);
    Route::post('/emotions',             [EmotionController::class, 'store']);
    Route::put('/emotions/{id}',         [EmotionController::class, 'update']);
    Route::delete('/emotions/{id}',      [EmotionController::class, 'destroy']);

    // ---------- NOTIFICATIONS ----------
    Route::get('/notifications',           [NotificationController::class, 'index']);
    Route::put('/notifications/read',      [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}',   [NotificationController::class, 'destroy']);
});
