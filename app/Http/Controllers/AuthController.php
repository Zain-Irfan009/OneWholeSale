<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\BaseController;

class AuthController extends BaseController
{
    use ApiResponser;

    public function register(Request $request)
    {
        $attr = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed'
        ]);

        $user = User::create([
            'name' => $attr['name'],
            'password' => bcrypt($attr['password']),
            'email' => $attr['email']
        ]);

        return $this->success([
            'token' => $user->createToken('API Token')->plainTextToken
        ]);
    }

//    public function login(Request $request)
//    {
//        $attr = $request->validate([
//            'email' => 'required|string|email|',
//            'password' => 'required|string|min:6'
//        ]);
//
//        if (!Auth::attempt($attr)) {
//            return $this->error('Credentials not match', 401);
//        }
//
//        return $this->success([
//            'token' => auth()->user()->createToken('API Token')->plainTextToken
//        ]);
//    }

    public function login(Request $request){
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Login information is invalid.'
            ], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('authToken')->plainTextToken;

        $success['token'] = $token;
        $success['user'] = $user;
        $success['message'] = 'User login successfully!';

        return $this->sendResponse($success, 'User login successfully.');
    }

    public function profile(){
        $user = auth()->user();
        $success['user'] = $user;
        return $this->sendResponse($success, 'User login successfully.');
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Tokens Revoked'
        ];
    }
}
