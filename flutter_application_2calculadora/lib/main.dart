import 'package:flutter/material.dart';

void main() {
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Calculadora',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: const CalculatorHomePage(),
    );
  }
}

class CalculatorHomePage extends StatefulWidget {
  const CalculatorHomePage({super.key});

  @override
  State<CalculatorHomePage> createState() => _CalculatorHomePageState();
}

class _CalculatorHomePageState extends State<CalculatorHomePage> {
  // Lo que se muestra en la pantalla
  String _display = '0';

  // Operando guardado antes de elegir un operador
  double? _previousValue;

  // Operador actualmente seleccionado: +, -, ×, ÷
  String? _operator;

  // Indica si el próximo dígito debe empezar un número nuevo
  bool _shouldResetDisplay = false;

  // Indica si hubo un error (ej. división por cero)
  bool _hasError = false;

  // ---------- Lógica ----------

  void _onDigitPressed(String digit) {
    setState(() {
      if (_hasError) {
        _display = digit;
        _hasError = false;
        _shouldResetDisplay = false;
        return;
      }
      if (_shouldResetDisplay || _display == '0') {
        _display = digit;
        _shouldResetDisplay = false;
      } else {
        _display += digit;
      }
    });
  }

  void _onDecimalPressed() {
    setState(() {
      if (_hasError) {
        _display = '0.';
        _hasError = false;
        _shouldResetDisplay = false;
        return;
      }
      if (_shouldResetDisplay) {
        _display = '0.';
        _shouldResetDisplay = false;
        return;
      }
      if (!_display.contains('.')) {
        _display += '.';
      }
    });
  }

  void _onClearPressed() {
    setState(() {
      _display = '0';
      _previousValue = null;
      _operator = null;
      _shouldResetDisplay = false;
      _hasError = false;
    });
  }

  void _onPlusMinusPressed() {
    setState(() {
      if (_hasError) return;
      final double value = double.parse(_display);
      _display = _formatNumber(value * -1);
    });
  }

  void _onPercentPressed() {
    setState(() {
      if (_hasError) return;
      final double value = double.parse(_display);
      _display = _formatNumber(value / 100);
    });
  }

  void _onOperatorPressed(String op) {
    setState(() {
      if (_hasError) return;

      final double currentValue = double.parse(_display);

      if (_operator != null && !_shouldResetDisplay) {
        // Ya había una operación pendiente: la resolvemos primero
        // (la calculadora de iPhone evalúa de izquierda a derecha,
        // sin precedencia de operadores).
        final double? result = _calculate(
          _previousValue!,
          currentValue,
          _operator!,
        );
        if (result == null) {
          _display = 'Error';
          _hasError = true;
          _previousValue = null;
          _operator = null;
          _shouldResetDisplay = true;
          return;
        }
        _previousValue = result;
        _display = _formatNumber(result);
      } else {
        _previousValue = currentValue;
      }

      _operator = op;
      _shouldResetDisplay = true;
    });
  }

  void _onEqualsPressed() {
    setState(() {
      if (_hasError || _operator == null || _previousValue == null) return;

      final double currentValue = double.parse(_display);
      final double? result = _calculate(
        _previousValue!,
        currentValue,
        _operator!,
      );

      if (result == null) {
        _display = 'Error';
        _hasError = true;
      } else {
        _display = _formatNumber(result);
      }

      _previousValue = null;
      _operator = null;
      _shouldResetDisplay = true;
    });
  }

  double? _calculate(double a, double b, String op) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        if (b == 0) return null; // división por cero -> Error
        return a / b;
      default:
        return b;
    }
  }

  String _formatNumber(double value) {
    if (value.isInfinite || value.isNaN) return 'Error';
    if (value == value.roundToDouble() && value.abs() < 1e15) {
      return value.toInt().toString();
    }
    String s = value.toString();
    // Evita colas largas de decimales flotantes
    if (s.contains('.')) {
      s = double.parse(value.toStringAsFixed(8))
          .toString()
          .replaceFirst(RegExp(r'0+$'), '')
          .replaceFirst(RegExp(r'\.$'), '');
    }
    return s;
  }

  bool get _isAllClear => _display == '0' && !_hasError && _operator == null;

  // ---------- UI ----------

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Pantalla
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Align(
                  alignment: Alignment.bottomRight,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    reverse: true,
                    child: Text(
                      _display,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 80,
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // Teclado
            Expanded(
              flex: 5,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          _buildButton(
                            _isAllClear ? 'AC' : 'C',
                            _CalcButtonType.function,
                            onTap: _onClearPressed,
                          ),
                          _buildButton(
                            '+/-',
                            _CalcButtonType.function,
                            onTap: _onPlusMinusPressed,
                          ),
                          _buildButton(
                            '%',
                            _CalcButtonType.function,
                            onTap: _onPercentPressed,
                          ),
                          _buildButton(
                            '÷',
                            _CalcButtonType.operatorBtn,
                            isSelected: _operator == '÷' && _shouldResetDisplay,
                            onTap: () => _onOperatorPressed('÷'),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          _buildButton(
                            '7',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('7'),
                          ),
                          _buildButton(
                            '8',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('8'),
                          ),
                          _buildButton(
                            '9',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('9'),
                          ),
                          _buildButton(
                            '×',
                            _CalcButtonType.operatorBtn,
                            isSelected: _operator == '×' && _shouldResetDisplay,
                            onTap: () => _onOperatorPressed('×'),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          _buildButton(
                            '4',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('4'),
                          ),
                          _buildButton(
                            '5',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('5'),
                          ),
                          _buildButton(
                            '6',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('6'),
                          ),
                          _buildButton(
                            '-',
                            _CalcButtonType.operatorBtn,
                            isSelected: _operator == '-' && _shouldResetDisplay,
                            onTap: () => _onOperatorPressed('-'),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          _buildButton(
                            '1',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('1'),
                          ),
                          _buildButton(
                            '2',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('2'),
                          ),
                          _buildButton(
                            '3',
                            _CalcButtonType.number,
                            onTap: () => _onDigitPressed('3'),
                          ),
                          _buildButton(
                            '+',
                            _CalcButtonType.operatorBtn,
                            isSelected: _operator == '+' && _shouldResetDisplay,
                            onTap: () => _onOperatorPressed('+'),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          _buildButton(
                            '0',
                            _CalcButtonType.number,
                            wide: true,
                            onTap: () => _onDigitPressed('0'),
                          ),
                          _buildButton(
                            '.',
                            _CalcButtonType.number,
                            onTap: _onDecimalPressed,
                          ),
                          _buildButton(
                            '=',
                            _CalcButtonType.operatorBtn,
                            onTap: _onEqualsPressed,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildButton(
    String label,
    _CalcButtonType type, {
    required VoidCallback onTap,
    bool wide = false,
    bool isSelected = false,
  }) {
    Color backgroundColor;
    Color textColor = Colors.white;

    switch (type) {
      case _CalcButtonType.function:
        backgroundColor = const Color(0xFFA5A5A5);
        textColor = Colors.black;
        break;
      case _CalcButtonType.operatorBtn:
        backgroundColor = isSelected ? Colors.white : const Color(0xFFFF9F0A);
        textColor = isSelected ? const Color(0xFFFF9F0A) : Colors.white;
        break;
      case _CalcButtonType.number:
        backgroundColor = const Color(0xFF333333);
        break;
    }

    return Expanded(
      flex: wide ? 2 : 1,
      child: Padding(
        padding: const EdgeInsets.all(6),
        child: Material(
          color: backgroundColor,
          shape: const StadiumBorder(),
          child: InkWell(
            customBorder: const StadiumBorder(),
            onTap: onTap,
            child: Align(
              alignment: wide ? Alignment.centerLeft : Alignment.center,
              child: Padding(
                padding: wide
                    ? const EdgeInsets.only(left: 28)
                    : EdgeInsets.zero,
                child: Text(
                  label,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 32,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

enum _CalcButtonType { number, function, operatorBtn }
