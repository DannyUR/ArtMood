<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string'
        ]);

        return Category::create($request->all());
    }

    public function show($id)
    {
        return Category::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:100|unique:categories,name,' . $id . ',id_categoria',
            'description' => 'sometimes|string'
        ]);

        $cat->update($request->all());

        return $cat;
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
