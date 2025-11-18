<?php

namespace App\Http\Controllers;

use App\Models\Emotion;
use Illuminate\Http\Request;

class EmotionController extends Controller
{
    public function index()
    {
        return Emotion::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:emotions,name',
            'icon' => 'nullable|string|max:10'
        ]);

        return Emotion::create($request->all());
    }

    public function show($id)
    {
        return Emotion::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $emotion = Emotion::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|unique:emotions,name,' . $id . ',id_emocion',
            'icon' => 'sometimes|string|max:10'
        ]);

        $emotion->update($request->all());

        return $emotion;
    }

    public function destroy($id)
    {
        Emotion::findOrFail($id)->delete();

        return response()->json(['message' => 'Emoji eliminado']);
    }
}
