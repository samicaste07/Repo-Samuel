import '../../domain/entities/usuario.dart';
import '../../domain/repositories/usuario_repository.dart';

class UsuarioMemoria implements UsuarioRepository {
  @override
  Future<List<Usuario>> obtener() async {
    return const [
      Usuario(id: 1, nombre: 'Ana Gómez', email: 'ana@example.com'),
      Usuario(id: 2, nombre: 'Carlos López', email: 'carlos@example.com'),
      Usuario(id: 3, nombre: 'Elena Pérez', email: 'elena@example.com'),
    ];
  }
}
