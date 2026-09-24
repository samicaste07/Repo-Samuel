import 'package:supabase_flutter/supabase_flutter.dart';

import '../../domain/entities/perfil.dart';
import '../../domain/repositories/perfiles_repository.dart';

class SupabasePerfilesRepository implements PerfilesRepository {
  final SupabaseClient _client;

  SupabasePerfilesRepository({SupabaseClient? client})
    : _client = client ?? Supabase.instance.client;

  @override
  Future<void> crear(String id, String nombre) async {
    await _client.from('perfiles').insert({'id': id, 'nombre': nombre});
  }

  @override
  Future<List<Perfil>> obtenerTodos() async {
    final response = await _client.from('perfiles').select();
    final list = response as List<dynamic>;

    return list.map((item) {
      final map = item as Map<String, dynamic>;
      final rawDate = map['creado_en'] ?? map['created_at'];
      final DateTime creadoEn = rawDate != null
          ? DateTime.parse(rawDate.toString())
          : DateTime.now();

      return Perfil(
        id: (map['id'] ?? '').toString(),
        nombre: (map['nombre'] ?? '').toString(),
        creadoEn: creadoEn,
      );
    }).toList();
  }
}
