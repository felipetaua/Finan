import 'package:flutter/material.dart';

class EducationPage extends StatelessWidget {
  const EducationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            reverse: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Barra de busca
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    border: Border.all(width: 1, color: Colors.grey),
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const TextField(
                    decoration: InputDecoration(
                      icon: Icon(Icons.search),
                      hintText: 'Pesquise',
                      border: InputBorder.none,
                      suffixIcon: Icon(Icons.filter_list),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Educação doméstica
                const Text(
                  'Educação doméstica',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),

                SizedBox(
                  height: 150,
                  child: PageView(
                    controller: PageController(viewportFraction: 0.9),
                    children: [
                      _buildCard(
                        title: 'Tutoriais e\nCursos',
                        color: const Color(0xFFF3B53E),
                        imagePath: 'assets/images/Edu-carteira.jpg',
                      ),
                      _buildCard(
                        title: 'Dicas de\nInvestimento',
                        color: const Color(0xFF4CAF50),
                        imagePath: 'assets/images/Edu-porco.jpg',
                      ),
                      _buildCard(
                        title: 'Planejamento\nFinanceiro',
                        color: const Color(0xFF2196F3),
                        imagePath: 'assets/images/Edu-planejamento.jpg',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3B53E),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Tutoriais e\nCursos',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Image.asset(
                        'assets/images/globo-estudo.png',
                        height: 50,
                        width: 50,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Categorias
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      'Categorias',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'ver tudo',
                      style: TextStyle(color: Color(0xFF368DF7)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: const [
                      _CategoriaItem(
                        icon: Icons.description,
                        color: Colors.grey,
                      ),
                      _CategoriaItem(icon: Icons.map, color: Colors.indigo),
                      _CategoriaItem(icon: Icons.favorite, color: Colors.green),
                      _CategoriaItem(
                        icon: Icons.grid_view,
                        color: Colors.purple,
                      ),
                      _CategoriaItem(
                        icon: Icons.sports_basketball,
                        color: Colors.orange,
                      ),
                      _CategoriaItem(icon: Icons.percent, color: Colors.red),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Cursos e conteúdo
                const Text(
                  'Cursos e conteúdo',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),

                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF4CE),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Controle de\ngastos de\nforma eficiente',
                              style: TextStyle(fontSize: 16),
                            ),
                            const SizedBox(height: 8),
                            ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.grey[700],
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24,
                                ),
                              ),
                              child: const Text('Iniciar'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Image.asset(
                        'assets/images/educacao-icon.png',
                        height: 60,
                        width: 60,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Widget _buildCard({
  required String title,
  required Color color,
  required String imagePath,
}) {
  return Container(
    margin: const EdgeInsets.symmetric(horizontal: 8),
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(16),
    ),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        Image.asset(imagePath, height: 130, width: 130),
      ],
    ),
  );
}

class _CategoriaItem extends StatelessWidget {
  final IconData icon;
  final Color color;

  const _CategoriaItem({required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        // ignore: deprecated_member_use
        color: color.withOpacity(0.2),
      ),
      child: Icon(icon, color: color),
    );
  }
}
