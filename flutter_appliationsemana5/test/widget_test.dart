import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_appliationsemana5/data/repositories/usuario_api.dart';
import 'package:flutter_appliationsemana5/domain/usecases/obtener_usuarios_con_vocal.dart';
import 'package:flutter_appliationsemana5/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    final repository = UsuarioApi();
    final useCase = ObtenerUsuariosConVocal(repository);

    await tester.pumpWidget(MyApp(obtenerUsuariosConVocal: useCase));
    expect(find.byType(MyApp), findsOneWidget);
  });
}
