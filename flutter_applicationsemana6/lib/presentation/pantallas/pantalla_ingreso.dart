import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/sesion_provider.dart';
import 'pantalla_usuarios.dart';

class PantallaIngreso extends StatefulWidget {
  const PantallaIngreso({super.key});

  @override
  State<PantallaIngreso> createState() => _PantallaIngresoState();
}

class _PantallaIngresoState extends State<PantallaIngreso> {
  final _correoController = TextEditingController();
  final _claveController = TextEditingController();
  final _nombreController = TextEditingController();

  @override
  void dispose() {
    _correoController.dispose();
    _claveController.dispose();
    _nombreController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sesion = context.watch<SesionProvider>();

    if (sesion.idUsuario != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const PantallaUsuarios()),
          );
        }
      });
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Autenticación')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                controller: _nombreController,
                decoration: const InputDecoration(
                  labelText: 'Nombre',
                  border: OutlineInputBorder(),
                ),
                enabled: !sesion.cargando,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _correoController,
                decoration: const InputDecoration(
                  labelText: 'Correo electrónico',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                enabled: !sesion.cargando,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _claveController,
                decoration: const InputDecoration(
                  labelText: 'Contraseña',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                enabled: !sesion.cargando,
              ),
              const SizedBox(height: 16),
              if (sesion.error != null) ...[
                Text(
                  sesion.error!,
                  style: const TextStyle(color: Colors.red),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
              ],
              if (sesion.cargando) ...[
                const Center(child: CircularProgressIndicator()),
                const SizedBox(height: 16),
              ],
              ElevatedButton(
                onPressed: sesion.cargando
                    ? null
                    : () {
                        context.read<SesionProvider>().ingresar(
                          _correoController.text.trim(),
                          _claveController.text,
                        );
                      },
                child: const Text('Ingresar'),
              ),
              const SizedBox(height: 8),
              OutlinedButton(
                onPressed: sesion.cargando
                    ? null
                    : () {
                        context.read<SesionProvider>().registrar(
                          _correoController.text.trim(),
                          _claveController.text,
                          _nombreController.text.trim(),
                        );
                      },
                child: const Text('Crear cuenta'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
