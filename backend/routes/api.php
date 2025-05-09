<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedicalRecordController;

Route::apiResource('patients', PatientController::class);
Route::apiResource('records', MedicalRecordController::class);
Route::get('patients/{id}/records', [PatientController::class, 'records']);




