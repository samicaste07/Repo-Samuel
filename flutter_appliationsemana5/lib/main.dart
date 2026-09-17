import 'package:flutter/material.dart';

import 'data/repositories/usuario_memoria.dart';
import 'domain/entities/usuario.dart';
import 'domain/usecases/obtener_usuarios_con_vocal.dart';

void main() {
  // --- Composition Root ---
  // 1. Instanciación del repositorio concreto en memoria (capa de datos)
  final usuarioMemoria = UsuarioMemoria();

  // 2. Construcción del caso de uso inyectándole la implementación del repositorio en memoria
  final obtenerUsuariosConVocal = ObtenerUsuariosConVocal(usuarioMemoria);

  // 3. Inicio de la app inyectando el caso de uso a la interfaz de usuario
  runApp(MyApp(obtenerUsuariosConVocal: obtenerUsuariosConVocal));
}

class MyApp extends StatelessWidget {
  final ObtenerUsuariosConVocal obtenerUsuariosConVocal;

  const MyApp({super.key, required this.obtenerUsuariosConVocal});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Usuarios',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
      ),
      home: UsersScreen(obtenerUsuariosConVocal: obtenerUsuariosConVocal),
    );
  }
}

class UsersScreen extends StatefulWidget {
  final ObtenerUsuariosConVocal obtenerUsuariosConVocal;

  const UsersScreen({super.key, required this.obtenerUsuariosConVocal});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  late Future<List<Usuario>> _usersFuture;

  @override
  void initState() {
    super.initState();
    _usersFuture = widget.obtenerUsuariosConVocal.ejecutar();
  }

  Future<void> _reloadUsers() async {
    setState(() {
      _usersFuture = widget.obtenerUsuariosConVocal.ejecutar();
    });

    await _usersFuture;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Usuarios con nombre vocal'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: FutureBuilder<List<Usuario>>(
        future: _usersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, size: 48),
                    const SizedBox(height: 12),
                    Text(
                      'Ocurrió un error al cargar usuarios.\n${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    FilledButton.icon(
                      onPressed: _reloadUsers,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            );
          }

          final users = snapshot.data ?? [];

          if (users.isEmpty) {
            return const Center(
              child: Text('No hay usuarios cuyo nombre empiece con vocal.'),
            );
          }

          return RefreshIndicator(
            onRefresh: _reloadUsers,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: users.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final user = users[index];

                return Card(
                  margin: EdgeInsets.zero,
                  child: ListTile(
                    leading: CircleAvatar(
                      child: Text(
                        user.nombre.isNotEmpty
                            ? user.nombre[0].toUpperCase()
                            : '?',
                      ),
                    ),
                    title: Text(user.nombre),
                    subtitle: Text(user.email),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
