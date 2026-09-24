import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/perfiles_provider.dart';
import '../providers/sesion_provider.dart';
import 'pantalla_ingreso.dart';

class PantallaUsuarios extends StatefulWidget {
  const PantallaUsuarios({super.key});

  @override
  State<PantallaUsuarios> createState() => _PantallaUsuariosState();
}

class _PantallaUsuariosState extends State<PantallaUsuarios> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        context.read<PerfilesProvider>().cargar();
      }
    });
  }

  Future<void> _cerrarSesion() async {
    await context.read<SesionProvider>().salir();
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const PantallaIngreso()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final perfilesProv = context.watch<PerfilesProvider>();

    Widget contenido;
    if (perfilesProv.cargando) {
      contenido = const Center(child: CircularProgressIndicator());
    } else if (perfilesProv.error != null) {
      contenido = Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                perfilesProv.error!,
                style: const TextStyle(color: Colors.red),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => context.read<PerfilesProvider>().cargar(),
                icon: const Icon(Icons.refresh),
                label: const Text('Reintentar'),
              ),
            ],
          ),
        ),
      );
    } else if (perfilesProv.perfiles.isEmpty) {
      contenido = const Center(child: Text('No hay perfiles registrados.'));
    } else {
      contenido = ListView.builder(
        itemCount: perfilesProv.perfiles.length,
        itemBuilder: (context, index) {
          final perfil = perfilesProv.perfiles[index];
          return ListTile(
            leading: const CircleAvatar(child: Icon(Icons.person)),
            title: Text(
              perfil.nombre.isNotEmpty ? perfil.nombre : 'Sin nombre',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text('Creado: ${perfil.creadoEn.toLocal()}'),
          );
        },
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Usuarios'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Recargar',
            onPressed: () {
              context.read<PerfilesProvider>().cargar();
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Cerrar sesión',
            onPressed: _cerrarSesion,
          ),
        ],
      ),
      body: contenido,
    );
  }
}
