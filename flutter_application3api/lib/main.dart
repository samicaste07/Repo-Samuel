import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Scorebat Feed',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MatchesPage(),
    );
  }
}

// ---------- Modelo de datos ----------
// Representa un partido/video tal como viene en el JSON de la API.
class Match {
  final String title;
  final String competition;
  final String date;
  final String thumbnail;

  Match({
    required this.title,
    required this.competition,
    required this.date,
    required this.thumbnail,
  });

  // Constructor "factory" que arma un Match a partir de un Map
  // (el resultado de decodificar un objeto JSON individual).
  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      title: json['title'] ?? 'Sin título',
      competition: json['competition'] ?? 'Desconocida',
      date: json['date'] ?? '',
      thumbnail: json['thumbnail'] ?? '',
    );
  }
}

class MatchesPage extends StatefulWidget {
  const MatchesPage({super.key});

  @override
  State<MatchesPage> createState() => _MatchesPageState();
}

class _MatchesPageState extends State<MatchesPage> {
  // Guardamos el Future para no volver a lanzar la petición en cada rebuild.
  late Future<List<Match>> _matchesFuture;

  @override
  void initState() {
    super.initState();
    _matchesFuture = _fetchMatches();
  }

  // ---------- Llamada a la API ----------
  // async/await #1 y #2: esta función completa es "async" y usa "await"
  // dos veces: una para esperar la respuesta HTTP y, dentro del parseo,
  // el trabajo de json.decode es síncrono pero ocurre después del await.
  Future<List<Match>> _fetchMatches() async {
    final url = Uri.parse('https://www.scorebat.com/video-api/v3/');

    // --- MÉTODO GET ---
    // http.get() arma y envía una petición HTTP GET a esa URL.
    final http.Response response = await http.get(url);

    // --- CÓDIGO DE ESTADO ---
    // response.statusCode trae el código HTTP que respondió el servidor
    // (200 = OK, 404 = no encontrado, 500 = error del servidor, etc.)
    if (response.statusCode == 200) {
      // --- JSON ---
      // response.body es el texto crudo de la respuesta.
      // json.decode lo convierte en estructuras de Dart (Map/List).
      final Map<String, dynamic> data = json.decode(response.body);
      final List<dynamic> responseList = data['response'] ?? [];

      return responseList
          .map((item) => Match.fromJson(item as Map<String, dynamic>))
          .toList();
    } else {
      throw Exception(
        'Error al cargar los datos. Código de estado: ${response.statusCode}',
      );
    }
  }

  // Permite volver a intentar la petición (botón de refrescar / reintentar).
  Future<void> _reload() async {
    setState(() {
      _matchesFuture = _fetchMatches();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Últimos partidos (Scorebat)'),
        actions: [
          IconButton(
            onPressed: _reload,
            icon: const Icon(Icons.refresh),
            tooltip: 'Recargar',
          ),
        ],
      ),
      // FutureBuilder reconstruye la UI automáticamente según el estado
      // del Future: cargando, con error, o con datos listos.
      body: FutureBuilder<List<Match>>(
        future: _matchesFuture,
        builder: (context, snapshot) {
          // Mientras la petición está en curso (esperando la respuesta)
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // Si hubo un error (sin internet, código de estado distinto de 200, etc.)
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  'Ocurrió un error:\n${snapshot.error}',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          final matches = snapshot.data ?? [];

          if (matches.isEmpty) {
            return const Center(child: Text('No hay datos disponibles.'));
          }

          // Datos listos: los mostramos en una lista
          return RefreshIndicator(
            onRefresh: _reload,
            child: ListView.builder(
              itemCount: matches.length,
              itemBuilder: (context, index) {
                final match = matches[index];
                return ListTile(
                  leading: match.thumbnail.isNotEmpty
                      ? Image.network(
                          match.thumbnail,
                          width: 80,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.image_not_supported),
                        )
                      : const Icon(Icons.sports_soccer),
                  title: Text(match.title),
                  subtitle: Text('${match.competition} · ${match.date}'),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
