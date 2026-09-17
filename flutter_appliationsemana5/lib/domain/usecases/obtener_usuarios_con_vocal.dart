import '../entities/usuario.dart';
import '../repositories/usuario_repository.dart';

class ObtenerUsuariosConVocal {
  final UsuarioRepository repository;

  const ObtenerUsuariosConVocal(this.repository);

  Future<List<Usuario>> ejecutar() async {
    final usuarios = await repository.obtener();
    final vocales = {'a', 'e', 'i', 'o', 'u'};

    return usuarios.where((usuario) {
      final nombreLimpio = usuario.nombre.trim().toLowerCase();
      return nombreLimpio.isNotEmpty && vocales.contains(nombreLimpio[0]);
    }).toList();
  }

  Future<List<Usuario>> call() => ejecutar();
}
