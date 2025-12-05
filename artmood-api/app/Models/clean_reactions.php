<?php
// clean_reactions.php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Reaction;

$userId = 3;
$workId = 1;

echo "=== LIMPIANDO REACCIONES DEL USUARIO $userId EN OBRA $workId ===\n";

// Ver antes
$before = Reaction::where('id_usuario', $userId)
    ->where('id_obra', $workId)
    ->count();
echo "Reacciones antes: $before\n";

// Mostrar qué hay
$reactions = Reaction::where('id_usuario', $userId)
    ->where('id_obra', $workId)
    ->get();
    
foreach ($reactions as $reaction) {
    echo "  - ID: {$reaction->id_reaccion} | Emoji: {$reaction->emoji}\n";
}

// Eliminar
$deleted = Reaction::where('id_usuario', $userId)
    ->where('id_obra', $workId)
    ->delete();
    
echo "Reacciones eliminadas: $deleted\n";

// Ver después
$after = Reaction::where('id_usuario', $userId)
    ->where('id_obra', $workId)
    ->count();
echo "Reacciones después: $after\n";

// Ver todas las reacciones en obra 1
echo "\n=== TODAS LAS REACCIONES EN OBRA $workId ===\n";
$allReactions = Reaction::where('id_obra', $workId)->get();

foreach ($allReactions->groupBy('emoji') as $emoji => $group) {
    $userIds = $group->pluck('id_usuario')->toArray();
    echo "Emoji: $emoji | Cantidad: {$group->count()} | Usuarios: " . implode(', ', $userIds) . "\n";
}

echo "\n✅ ¡Limpieza completada!\n";