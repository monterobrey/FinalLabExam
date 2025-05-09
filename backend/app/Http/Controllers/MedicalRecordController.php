<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index() {
        return MedicalRecord::with('patient')->get();
    }

    public function store(Request $request) {
        return MedicalRecord::create($request->all());
    }

    public function show($id) {
        return MedicalRecord::findOrFail($id);
    }

    public function update(Request $request, $id) {
        $record = MedicalRecord::findOrFail($id);
        $record->update($request->all());
        return $record;
    }

    public function destroy($id) {
        return MedicalRecord::destroy($id);
    }
}

