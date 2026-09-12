<?php

use App\Models\Chat\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders', function () {
    return auth()->check();
});


Broadcast::channel('conversation.{conversation_id}', function (User $user, $conversation_id) {
    $conversation = Conversation::find($conversation_id);
    if (!$conversation) {
        return false;
    }

    return $conversation->user_one_id === $user->id || $conversation->user_two_id === $user->id;
},['web','auth']);
