import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../domain/entities/usuario.dart';
import '../../domain/repositories/usuario_repository.dart';

class UsuarioApi implements UsuarioRepository {
  final http.Client client;

  UsuarioApi({http.Client? client}) : client = client ?? http.Client();

  @override
  Future<List<Usuario>> obtener() async {
    final response = await client.get(
      Uri.parse('https://jsonplaceholder.typicode.com/users'),
    );

    if (response.statusCode != 200) {
      throw Exception('No se pudieron obtener los usuarios de la API');
    }

    final decodedJson = jsonDecode(response.body) as List<dynamic>;

    return decodedJson.map((item) {
      final jsonMap = item as Map<String, dynamic>;
      return Usuario(
        id: jsonMap['id'] as int,
        nombre: jsonMap['name'] as String,
        email: jsonMap['email'] as String,
      );
    }).toList();
  }
}
