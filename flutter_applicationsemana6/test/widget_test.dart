import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_applicationsemana6/domain/entities/perfil.dart';
import 'package:flutter_applicationsemana6/domain/repositories/auth_repository.dart';
import 'package:flutter_applicationsemana6/domain/repositories/perfiles_repository.dart';
import 'package:flutter_applicationsemana6/domain/usecases/registrar_usuario.dart';
import 'package:flutter_applicationsemana6/main.dart';
import 'package:flutter_applicationsemana6/presentation/providers/perfiles_provider.dart';
import 'package:flutter_applicationsemana6/presentation/providers/sesion_provider.dart';

class FakeAuthRepository implements AuthRepository {
  @override
  String? obtenerIdActual() => null;
  @override
  Future<void> ingresar(String correo, String clave) async {}
  @override
  Future<String> registrar(String correo, String clave) async => 'fake-id';
  @override
  Future<void> salir() async {}
}

class FakePerfilesRepository implements PerfilesRepository {
  @override
  Future<void> crear(String id, String nombre) async {}
  @override
  Future<List<Perfil>> obtenerTodos() async => [];
}

void main() {
  testWidgets('App renders PantallaIngreso with providers', (
    WidgetTester tester,
  ) async {
    final fakeAuth = FakeAuthRepository();
    final fakePerfiles = FakePerfilesRepository();
    final registrar = RegistrarUsuario(fakeAuth, fakePerfiles);

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) => SesionProvider(fakeAuth, registrar),
          ),
          ChangeNotifierProvider(create: (_) => PerfilesProvider(fakePerfiles)),
        ],
        child: const MyApp(),
      ),
    );

    expect(find.text('Autenticación'), findsOneWidget);
    expect(find.text('Ingresar'), findsOneWidget);
    expect(find.text('Crear cuenta'), findsOneWidget);
  });
}
