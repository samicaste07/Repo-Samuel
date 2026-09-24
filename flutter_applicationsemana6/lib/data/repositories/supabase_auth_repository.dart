import 'package:supabase_flutter/supabase_flutter.dart';

import '../../domain/repositories/auth_repository.dart';

class SupabaseAuthRepository implements AuthRepository {
  final SupabaseClient _client;

  SupabaseAuthRepository({SupabaseClient? client})
    : _client = client ?? Supabase.instance.client;

  @override
  Future<String> registrar(String correo, String clave) async {
    final response = await _client.auth.signUp(email: correo, password: clave);
    final user = response.user;
    if (user == null) {
      throw Exception('No se pudo obtener el usuario registrado en Supabase.');
    }
    return user.id;
  }

  @override
  Future<void> ingresar(String correo, String clave) async {
    await _client.auth.signInWithPassword(email: correo, password: clave);
  }

  @override
  Future<void> salir() async {
    await _client.auth.signOut();
  }

  @override
  String? obtenerIdActual() {
    return _client.auth.currentUser?.id;
  }
}
