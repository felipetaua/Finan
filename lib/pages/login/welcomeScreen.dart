import 'package:finan/pages/home/main/homeScreen.dart';
import 'package:finan/pages/login/foco.dart';
import 'package:finan/pages/login/login.dart';
import 'package:finan/pages/login/register.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart'; // Certifique-se de adicionar no pubspec.yaml

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(60.0),
        child: ClipRRect(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(25)),
          child: AppBar(
            title: Text(
              'Finan',
              style: const TextStyle(
                fontFamily: 'Madimi One',
                fontWeight: FontWeight.bold,
              ),
            ),
            backgroundColor: Colors.blue,
            foregroundColor: Colors.white,
          ),
        ),
      ),
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                Image.asset('assets/images/money.png', height: 150),
                const SizedBox(height: 40),
                Text(
                  'Welcome, Finan',
                  style: const TextStyle(
                    fontSize: 24,
                    fontFamily: 'Madimi One',
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF377DFF),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Você pode organizar suas\nfinanças de forma fácil e prática.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        PageRouteBuilder(
                          transitionDuration: const Duration(milliseconds: 500),
                          pageBuilder: (_, __, ___) => const LoginPage(),
                          transitionsBuilder: (_, animation, __, child) {
                            const begin = Offset(
                              1.0,
                              0.0,
                            ); // Começa fora da tela à direita
                            const end = Offset.zero; // Termina no centro
                            const curve = Curves.ease;

                            final tween = Tween(
                              begin: begin,
                              end: end,
                            ).chain(CurveTween(curve: curve));
                            final offsetAnimation = animation.drive(tween);

                            return SlideTransition(
                              position: offsetAnimation,
                              child: child,
                            );
                          },
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: const Color(0xFF377DFF),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                    child: const Text('Login', style: TextStyle(fontSize: 16)),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('or'),
                const SizedBox(height: 16),
                // Botão Google
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      //login google
                      Navigator.push(
                        context,
                        PageRouteBuilder(
                          transitionDuration: const Duration(milliseconds: 500),
                          pageBuilder: (_, __, ___) => const FocoPage(),
                          transitionsBuilder: (_, animation, __, child) {
                            const begin = Offset(
                              1.0,
                              0.0,
                            ); // Começa fora da tela à direita
                            const end = Offset.zero; // Termina no centro
                            const curve = Curves.ease;

                            final tween = Tween(
                              begin: begin,
                              end: end,
                            ).chain(CurveTween(curve: curve));
                            final offsetAnimation = animation.drive(tween);

                            return SlideTransition(
                              position: offsetAnimation,
                              child: child,
                            );
                          },
                        ),
                      );
                    },
                    icon: Image.asset('assets/icons/google.png', height: 20),
                    label: const Text('Continue with Google'),
                    style: OutlinedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.grey,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Botão Apple
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // login com Aplle
                      Navigator.push(
                        context,
                        PageRouteBuilder(
                          transitionDuration: const Duration(milliseconds: 500),
                          pageBuilder:
                              (_, __, ___) => const GastosPage(nomeUsuario: ''),
                          transitionsBuilder: (_, animation, __, child) {
                            const begin = Offset(
                              1.0,
                              0.0,
                            ); // Começa fora da tela à direita
                            const end = Offset.zero; // Termina no centro
                            const curve = Curves.ease;

                            final tween = Tween(
                              begin: begin,
                              end: end,
                            ).chain(CurveTween(curve: curve));
                            final offsetAnimation = animation.drive(tween);

                            return SlideTransition(
                              position: offsetAnimation,
                              child: child,
                            );
                          },
                        ),
                      );
                    },
                    icon: Image.asset('assets/icons/apple.png', height: 20),
                    label: const Text('Continue with Apple'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Não possui conta? '),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          PageRouteBuilder(
                            transitionDuration: const Duration(
                              milliseconds: 500,
                            ),
                            pageBuilder: (_, __, ___) => const RegisterPage(),
                            transitionsBuilder: (_, animation, __, child) {
                              const begin = Offset(
                                1.0,
                                0.0,
                              ); // Começa fora da tela à direita
                              const end = Offset.zero; // Termina no centro
                              const curve = Curves.ease;

                              final tween = Tween(
                                begin: begin,
                                end: end,
                              ).chain(CurveTween(curve: curve));
                              final offsetAnimation = animation.drive(tween);

                              return SlideTransition(
                                position: offsetAnimation,
                                child: child,
                              );
                            },
                          ),
                        );
                      },
                      child: Text(
                        'Registre-se',
                        style: TextStyle(
                          color: Color(0xFF377DFF),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
