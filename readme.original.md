# 🏋️ Gym Progress Intelligence

## The intelligent fitness progression platform

Gym Progress Intelligence es una plataforma integral de entrenamiento, análisis y seguimiento diseñada para transformar los datos reales de una persona en **información útil, recomendaciones y decisiones de entrenamiento**.

El proyecto combina:

* 🏋️ Seguimiento de entrenamientos
* 💪 Análisis de fuerza
* 🧪 1RM y 1RM estimado
* 📈 Seguimiento de progreso
* 🧠 Entrenamiento adaptativo
* 🍗 Nutrición
* 🫀 Recuperación
* ⚡ Eficiencia del entrenamiento
* 🤖 Coach digital
* 📚 Knowledge Engine de metodologías
* 🏆 Gamificación
* 🌎 Funcionalidades sociales

La visión a largo plazo es construir una especie de:

> **"Strava + MyFitnessPal + Coach digital, especializado en musculación."**

Pero el objetivo principal es ir más allá de registrar datos.

La aplicación debe poder responder:

> **¿Cómo estoy progresando, por qué estoy progresando o estancándome y qué debería hacer después?**

---

# 📋 Índice

1. [Visión del proyecto](#1-visión-del-proyecto)
2. [Objetivos](#2-objetivos)
3. [Filosofía del producto](#3-filosofía-del-producto)
4. [Perfil del atleta](#4-perfil-del-atleta)
5. [Evaluación inicial](#5-evaluación-inicial)
6. [Sistema de entrenamiento](#6-sistema-de-entrenamiento)
7. [Sistema de fuerza](#7-sistema-de-fuerza)
8. [Sistema 1RM](#8-sistema-1rm)
9. [Sistema e1RM](#9-sistema-e1rm)
10. [Sistema de progresión](#10-sistema-de-progresión)
11. [Progress Engine](#11-progress-engine)
12. [Sistema de recuperación](#12-sistema-de-recuperación)
13. [Sistema de nutrición](#13-sistema-de-nutrición)
14. [Gasto energético](#14-gasto-energético)
15. [Training Efficiency](#15-training-efficiency)
16. [Athlete State](#16-athlete-state)
17. [Knowledge Engine](#17-knowledge-engine)
18. [Metodologías de entrenamiento](#18-metodologías-de-entrenamiento)
19. [Heavy Duty / HIT](#19-heavy-duty--hit)
20. [Rutinas históricas de Heavy Duty](#20-rutinas-históricas-de-heavy-duty)
21. [Estrategias Heavy Duty](#21-estrategias-heavy-duty)
22. [Adaptación de metodologías](#22-adaptación-de-metodologías)
23. [Generador de rutinas](#23-generador-de-rutinas)
24. [Coach digital](#24-coach-digital)
25. [Objetivos](#25-objetivos)
26. [Estadísticas](#26-estadísticas)
27. [Gamificación](#27-gamificación)
28. [Sistema social](#28-sistema-social)
29. [Dashboard](#29-dashboard)
30. [Modelo de datos](#30-modelo-de-datos)
31. [Arquitectura](#31-arquitectura)
32. [Seguridad y privacidad](#32-seguridad-y-privacidad)
33. [UX/UI](#33-uxui)
34. [Roadmap](#34-roadmap)
35. [MVP](#35-mvp)
36. [Fases futuras](#36-fases-futuras)
37. [Criterios de desarrollo](#37-criterios-de-desarrollo)
38. [Reglas de inteligencia](#38-reglas-de-inteligencia)
39. [Reglas de seguridad](#39-reglas-de-seguridad)
40. [Arquitectura conceptual completa](#40-arquitectura-conceptual-completa)
41. [Visión final](#41-visión-final)

---

# 1. 🎯 Visión del proyecto

La mayoría de las aplicaciones de gimnasio funcionan como simples registros:

```text
Ejercicio
    ↓
Peso
    ↓
Repeticiones
    ↓
Guardar
```

Gym Progress Intelligence busca hacer algo diferente.

El sistema debe transformar los datos del usuario en conocimiento accionable.

```text
ENTRENAMIENTO
      ↓
DATOS
      ↓
ANÁLISIS
      ↓
INTERPRETACIÓN
      ↓
DECISIÓN
      ↓
RECOMENDACIÓN
      ↓
NUEVO ENTRENAMIENTO
      ↓
NUEVOS DATOS
      ↓
...
```

El sistema construirá progresivamente una representación del estado actual del atleta.

No solamente interesa saber:

> "¿Cuánto levantaste?"

También interesa saber:

> "¿Cómo estás respondiendo al entrenamiento?"

> "¿Estás recuperándote?"

> "¿Estás progresando?"

> "¿Por qué te estancaste?"

> "¿Conviene aumentar la carga?"

> "¿Conviene mantenerla?"

> "¿Necesitás recuperar?"

> "¿La alimentación acompaña el objetivo?"

> "¿Qué debería cambiar en tu próximo entrenamiento?"

---

# 2. 🚀 Objetivos

## Objetivo principal

Crear una plataforma capaz de:

* Registrar entrenamientos.
* Medir fuerza.
* Calcular 1RM.
* Estimar e1RM.
* Detectar progreso.
* Detectar estancamientos.
* Analizar recuperación.
* Analizar nutrición.
* Analizar eficiencia.
* Generar rutinas.
* Adaptar rutinas.
* Aplicar metodologías de entrenamiento.
* Establecer objetivos.
* Recomendar acciones.
* Registrar logros.
* Mostrar estadísticas.
* Construir un historial deportivo.
* Eventualmente ofrecer funcionalidades sociales.

---

## Público objetivo

La plataforma debe poder utilizarse por:

### 🟢 Principiantes

Personas que recién comienzan a entrenar.

La aplicación priorizará:

* Técnica.
* Aprendizaje.
* Seguridad.
* Progresión gradual.
* RIR moderado.
* Volumen razonable.

### 🟡 Intermedios

Usuarios con experiencia que ya conocen los principales movimientos y poseen historial.

### 🔴 Avanzados

Usuarios con entrenamiento estructurado, historial amplio y capacidad para utilizar métricas avanzadas.

---

# 3. 🧠 Filosofía del producto

El proyecto se basa en cinco principios.

## 1. Medir

Lo que no se registra es difícil de analizar.

## 2. Comparar

El rendimiento actual debe compararse con el historial.

## 3. Interpretar

Los datos deben convertirse en información.

## 4. Recomendar

La aplicación debe sugerir posibles acciones.

## 5. Adaptar

Las recomendaciones deben cambiar según la evolución del usuario.

---

# 4. 👤 Perfil del atleta

Cada usuario tendrá un perfil deportivo.

## Datos básicos

```text
Nombre
Fecha de nacimiento
Altura
Peso
Sexo opcional
```

## Información deportiva

```text
Nivel
Experiencia entrenando
Días disponibles
Duración por sesión
Equipamiento disponible
Preferencias
```

## Objetivos

```text
Ganar masa muscular
Aumentar fuerza
Perder grasa
Mantener peso
Recomposición corporal
Mejorar rendimiento
```

---

# 5. 🧪 Evaluación inicial

Antes de generar una rutina avanzada, la aplicación deberá conocer el estado inicial del atleta.

El objetivo no es simplemente preguntar:

> "¿Qué rutina querés?"

Primero debe evaluar:

```text
PERFIL
  ↓
EXPERIENCIA
  ↓
OBJETIVO
  ↓
FUERZA
  ↓
TÉCNICA / CAPACIDAD
  ↓
DISPONIBILIDAD
  ↓
EQUIPAMIENTO
  ↓
RECUPERACIÓN
  ↓
NUTRICIÓN
  ↓
ESTADO DEL ATLETA
```

## Evaluación de fuerza

Cuando sea apropiado, el usuario podrá realizar pruebas de fuerza.

Sin embargo, un principiante no debería verse obligado a realizar un 1RM real.

El sistema podrá utilizar:

* Tests submáximos.
* Repeticiones con carga conocida.
* e1RM.
* Historial de entrenamiento.
* Pruebas progresivas.

El sistema deberá priorizar la seguridad sobre la obtención de un número.

---

# 6. 🏋️ Sistema de entrenamiento

El usuario podrá:

* Crear rutinas.
* Utilizar rutinas generadas.
* Modificar rutinas.
* Registrar entrenamientos.
* Registrar ejercicios.
* Registrar series.
* Registrar repeticiones.
* Registrar peso.
* Registrar descansos.
* Registrar RIR.
* Registrar RPE.
* Registrar duración.
* Añadir observaciones.

---

## Registro de una serie

```text
Press banca

Serie 1
80 kg
8 reps
RIR 2

Serie 2
80 kg
8 reps
RIR 1

Serie 3
80 kg
7 reps
RIR 0
```

Cada serie deberá almacenarse individualmente.

Esto permitirá posteriormente calcular:

* Volumen.
* Tonelaje.
* Intensidad.
* e1RM.
* PRs.
* Tendencias.
* Eficiencia.
* Fatiga indirecta.

---

# 7. 💪 Sistema de fuerza

La plataforma tendrá un sistema específico para analizar la fuerza.

Se registrarán:

```text
Peso utilizado
Repeticiones
Series
Ejercicio
Fecha
RIR
RPE
1RM
e1RM
```

El sistema podrá analizar la evolución de fuerza por:

* Ejercicio.
* Grupo muscular.
* Período.
* Rutina.
* Metodología.

---

# 8. 🧪 Sistema 1RM

El 1RM representa el máximo peso que una persona puede levantar correctamente durante una repetición.

Ejemplo:

```text
Press banca

1RM = 100 kg
```

La aplicación podrá calcular porcentajes.

| % 1RM |   Peso |
| ----: | -----: |
|   50% |  50 kg |
|   60% |  60 kg |
|   70% |  70 kg |
|   75% |  75 kg |
|   80% |  80 kg |
|   85% |  85 kg |
|   90% |  90 kg |
|   95% |  95 kg |
|  100% | 100 kg |

---

## Historial de 1RM

Cada registro almacenará:

```text
Ejercicio
Peso
Fecha
Tipo
Fuente
Observaciones
```

Tipos:

```text
REAL
ESTIMATED
```

Ejemplo:

```text
01/01 → 100 kg
01/03 → 105 kg
01/06 → 110 kg
```

---

# 9. 📐 Sistema e1RM

No todos los usuarios deben realizar tests reales de 1RM.

La aplicación podrá estimar el 1RM a partir de una serie.

Ejemplo:

```text
80 kg × 8 reps
```

Fórmula de Epley:

```text
e1RM = peso × (1 + repeticiones / 30)
```

Resultado:

```text
e1RM ≈ 101.3 kg
```

El sistema debe tratarlo como una **estimación**, nunca como una medición exacta.

Podrán incorporarse distintas fórmulas y comparar sus resultados.

---

# 10. 📈 Sistema de progresión

El sistema analizará:

* Peso.
* Repeticiones.
* Series.
* Volumen.
* Intensidad.
* % del 1RM.
* RIR.
* RPE.
* Frecuencia.
* e1RM.
* Historial.
* Tendencias.

---

## Ejemplo

```text
1RM = 100 kg

70 kg:

Sesión 1 → 8 reps
Sesión 2 → 9 reps
Sesión 3 → 10 reps
Sesión 4 → 11 reps
Sesión 5 → 12 reps
```

El sistema puede detectar:

```text
📈 Progreso consistente
```

Y recomendar:

```text
Aumentar carga

70 kg → 75 kg
```

---

## Estados

```text
🚀 Progreso rápido
📈 Progreso
➡️ Estable
⚠️ Posible estancamiento
🔻 Disminución de rendimiento
🔥 Preparado para progresar
🧪 Posible nuevo PR
```

---

# 11. 🧠 Progress Engine

El Progress Engine será uno de los núcleos lógicos del sistema.

Debe ser independiente de React.

## Inputs

```text
Peso
Repeticiones
Series
RIR
RPE
Volumen
1RM
e1RM
Frecuencia
Historial
Objetivo
```

## Outputs

```text
Estado
Progreso
Tendencia
Confianza
Recomendación
```

---

## Confidence Score

Las recomendaciones no deberían depender de una única sesión.

Ejemplo:

```text
Confidence Score: 84%
```

La confianza podrá aumentar cuando:

* El rendimiento mejora durante varias sesiones.
* El e1RM aumenta.
* Se mantiene la técnica.
* Se mantiene el rango objetivo.
* Existe consistencia.
* El usuario se encuentra recuperado.

Esto reduce recomendaciones prematuras.

---

# 12. 🫀 Sistema de recuperación

El usuario podrá realizar un check-in diario.

## Datos

```text
Horas de sueño
Calidad del sueño
Energía
Estrés
Dolor muscular
Fatiga
Motivación
```

Ejemplo:

```text
Sueño: 6 h
Energía: 5/10
Estrés: 7/10
Dolor muscular: 4/10
Fatiga: 7/10
```

---

## Recovery Score

Ejemplo:

```text
Recovery Score

67 / 100

🟡 Recuperación moderada
```

El Recovery Score no deberá utilizarse como diagnóstico médico.

Será una métrica orientativa basada en los datos registrados.

---

# 13. 🍗 Sistema de nutrición

La nutrición será opcional.

El usuario podrá elegir:

```text
🔥 Perder grasa
⚖️ Mantener
💪 Ganar masa
🔄 Recomposición
```

## Datos

```text
Calorías
Proteínas
Carbohidratos
Grasas
Fibra
Agua
```

---

## Registro de comidas

El usuario podrá registrar:

```text
Desayuno
Almuerzo
Merienda
Cena
Snacks
```

Cada comida podrá contener:

```text
Alimento
Cantidad
Unidad
```

El sistema podrá calcular estimaciones nutricionales.

---

## Incertidumbre

La aplicación nunca debe presentar una estimación como una medición exacta.

Correcto:

```text
Fideos con tuco

Estimación:
650–800 kcal
```

Incorrecto:

```text
742 kcal exactas
```

Cuando falten cantidades o información nutricional, el sistema deberá comunicar la incertidumbre.

---

# 14. 🔥 Gasto energético

La plataforma podrá estimar:

```text
Metabolismo basal
Gasto diario
Actividad
Entrenamiento
```

El gasto del entrenamiento deberá presentarse como estimación.

Por ejemplo:

```text
Gasto estimado:
300–500 kcal
```

No:

```text
Has quemado exactamente 437 kcal.
```

En el futuro podrán integrarse:

* Smartwatch.
* Frecuencia cardíaca.
* Pasos.
* Actividad diaria.
* Sueño.

---

# 15. ⚡ Training Efficiency

La aplicación tendrá una métrica propia:

## Training Efficiency

No significa:

> Entrenamiento corto = entrenamiento bueno.

La eficiencia deberá relacionar los recursos utilizados con los resultados obtenidos.

### Recursos

```text
Tiempo
Volumen
Series
Descansos
Fatiga
```

### Resultados

```text
Progreso
Fuerza
Rendimiento
```

Ejemplo:

```text
Duración:
135 minutos

Progreso:
+1%

⚠️ Posible baja eficiencia
```

Otro:

```text
Duración:
55 minutos

Progreso:
+8%

🔥 Alta eficiencia
```

La métrica nunca deberá utilizarse como criterio absoluto.

---

# 16. 🧬 Athlete State

El sistema tendrá una representación dinámica del atleta.

```text
ATHLETE STATE

Fuerza          ↑
Rendimiento     ↑
Hipertrofia     ↑
Fatiga          →
Recuperación    ↑
Nutrición       ↓
Consistencia    ↑
```

Este estado alimentará el motor de decisiones.

---

# 17. 📚 Knowledge Engine

El Knowledge Engine será el sistema encargado de almacenar conocimiento estructurado sobre metodologías de entrenamiento.

No se debe limitar a almacenar una lista de ejercicios.

Debe comprender:

```text
FUENTES
   ↓
PRINCIPIOS
   ↓
ESTRATEGIAS
   ↓
RUTINAS
   ↓
ESTRUCTURAS
   ↓
REGLAS
   ↓
ADAPTACIÓN
```

---

## Regla de oro

La IA no debe inventar una metodología.

Cuando se trabaje con una metodología documentada:

```text
Fuente
  ↓
Conocimiento extraído
  ↓
Estructura
  ↓
Estrategia
  ↓
Adaptación
```

Toda información histórica deberá mantener su fuente.

---

# 18. 🏋️ Metodologías de entrenamiento

El sistema debe permitir incorporar diferentes metodologías.

Ejemplo:

```text
Standard Hypertrophy
Strength
Full Body
Upper / Lower
Push Pull Legs
HIT
Heavy Duty
Custom
```

La arquitectura debe permitir agregar nuevas metodologías sin modificar todo el sistema.

---

# 19. 🔥 Heavy Duty / HIT

Heavy Duty será una de las metodologías documentadas dentro del sistema.

La aplicación podrá utilizar principios asociados a Mike Mentzer, pero deberá diferenciar claramente entre:

```text
Rutina histórica
Adaptación
Rutina personalizada
```

---

## Principio fundamental

Un ejercicio por sí mismo no es necesariamente "Heavy Duty".

La metodología depende de:

```text
Ejercicios
+
Orden
+
Series
+
Intensidad
+
Descansos
+
Relaciones entre ejercicios
+
Técnicas
+
Frecuencia
+
Recuperación
```

Por lo tanto:

```text
Press banca
```

no es automáticamente Heavy Duty.

La estructura completa determina la estrategia.

---

# 20. 📚 Rutinas históricas de Heavy Duty

El sistema deberá poder almacenar las rutinas documentadas de Mentzer manteniendo su contexto histórico.

No se deben mezclar automáticamente diferentes épocas de su metodología.

Cada rutina deberá conservar:

```text
Autor
Metodología
Era
Nombre
Fuente
Libro
Capítulo
Página
Contexto
Workout
Ejercicios
Orden
Series
Repeticiones
Descanso
Técnicas
Frecuencia
```

---

## Fuentes

El proyecto podrá incorporar libros y documentos de Mike Mentzer.

Entre las fuentes de referencia se encuentran trabajos de distintas etapas de Heavy Duty, incluyendo:

```text
Heavy Duty: A Logical Approach to Muscle Building
Heavy Duty Arms
Heavy Duty Legs
Heavy Duty Chest & Back
Heavy Duty Shoulders
Heavy Duty Nutrition
Heavy Duty Journal
Heavy Duty Training for Women
Heavy Duty
Heavy Duty II: Mind and Body
The Integrated Man
High-Intensity Training the Mike Mentzer Way
```

Las fuentes deberán almacenarse separadamente y conservar su contexto.

---

# 21. 🧠 Estrategias Heavy Duty

El sistema deberá almacenar estrategias como entidades independientes.

Ejemplos:

```text
Pre-exhaustion
Supersets
Rest-pause
Forced reps
Negative reps
Reduced volume
High intensity
Extended recovery
Failure training
```

Cada estrategia deberá contener:

```text
Nombre
Descripción
Objetivo
Ejercicios involucrados
Orden
Descanso
Nivel recomendado
Riesgo
Fuente
Contexto
```

---

## Ejemplo: Pre-exhaustion

Una estructura puede ser:

```text
Aislamiento
    ↓
SIN DESCANSO
    ↓
Ejercicio compuesto
```

Ejemplo:

```text
Dumbbell Fly
       ↓
Incline Press
```

La finalidad es generar una determinada relación entre ejercicios.

---

# 22. 🧬 Adaptación de metodologías

Esta es una de las partes más importantes del proyecto.

La aplicación **no debe copiar automáticamente una rutina avanzada para un principiante**.

Debe preservar la lógica de la metodología y adaptar la ejecución.

---

## Ejemplo

Rutina histórica:

```text
Fly
↓
Incline Press
↓
Sin descanso
```

Usuario avanzado:

```text
Fly
↓
Incline Press
↓
Alta intensidad
```

Usuario principiante:

```text
Fly
↓
Descanso controlado
↓
Incline Press
↓
Intensidad moderada
```

La aplicación deberá marcar:

```text
ORIGINAL
```

o:

```text
ADAPTED
```

Nunca deberá presentar una adaptación como si fuera una rutina histórica original.

---

## Niveles

### 🟢 Principiante

Priorizar:

```text
Técnica
Seguridad
Aprendizaje
RIR
Control
Progresión
```

### 🟡 Intermedio

Puede incorporar:

```text
Mayor intensidad
Menor volumen
Progresión más agresiva
Técnicas avanzadas seleccionadas
```

### 🔴 Avanzado

Podrá utilizar:

```text
HIT
Heavy Duty
Trabajo cercano al fallo
Técnicas de intensidad
Menor volumen
Mayor recuperación
```

Siempre dependiendo del contexto individual.

---

# 23. 🤖 Generador de rutinas

El generador utilizará:

```text
Nivel
Objetivo
Experiencia
Días disponibles
Tiempo disponible
Equipamiento
Preferencias
Historial
Fuerza
Recuperación
Fatiga
Nutrición
Metodología
```

---

## Flujo

```text
PERFIL
   ↓
EVALUACIÓN
   ↓
ATHLETE STATE
   ↓
SELECCIÓN DE METODOLOGÍA
   ↓
SELECCIÓN DE ESTRUCTURA
   ↓
ADAPTACIÓN
   ↓
VALIDACIÓN
   ↓
RUTINA
```

---

## Tipos de rutina

### Historical

Rutina documentada.

```text
Sin modificaciones.
```

### Adapted

Basada en una rutina o estrategia histórica, pero modificada para el usuario.

```text
Fuente
+
Adaptación
```

### Custom

Rutina generada utilizando principios documentados, pero que no representa una rutina histórica específica.

Esto deberá quedar explícitamente indicado.

---

# 24. 🧠 Coach digital

El Coach será una de las principales funcionalidades.

Analizará:

```text
Entrenamiento
Fuerza
Nutrición
Recuperación
Objetivos
Historial
Metodología
```

y producirá:

```text
Estado
Interpretación
Recomendación
Motivo
Confianza
Próxima acción
```

---

## Ejemplo positivo

```text
Fuerza: ↑
Volumen: ↑
Sueño: ↑
Fatiga: baja
Nutrición: correcta
```

Resultado:

> 🟢 Tu recuperación es buena y tu rendimiento viene aumentando. Podés intentar progresar en carga o repeticiones manteniendo la técnica.

---

## Ejemplo negativo

```text
Fuerza: →
Sueño: ↓
Fatiga: ↑
Estrés: ↑
```

Resultado:

> 🟡 Tu rendimiento se mantiene, pero tus indicadores de recuperación están disminuidos. No parece un buen momento para buscar un récord.

---

## Recuperación comprometida

```text
Fuerza: ↓
Sueño: ↓
Fatiga: ↑
Rendimiento: ↓
```

Resultado:

> 🔴 Tus indicadores actuales sugieren priorizar recuperación antes de aumentar la exigencia.

---

# 25. 🎯 Objetivos

El usuario podrá establecer objetivos.

Ejemplo:

```text
Press banca

Actual:
110 kg

Objetivo:
120 kg
```

Visualización:

```text
████████░░ 83%

110 / 120 kg
```

Otros objetivos:

```text
Aumentar 1RM
Perder peso
Ganar masa
Mejorar composición corporal
Mejorar un grupo muscular
Aumentar frecuencia
Mantener una racha
```

---

# 26. 📊 Estadísticas

## Fuerza

```text
1RM
e1RM
PR
Peso máximo
```

## Volumen

```text
Series
Repeticiones
Tonelaje
```

## Consistencia

```text
Entrenamientos
Frecuencia
Rachas
```

## Nutrición

```text
Calorías
Proteínas
Macros
```

## Recuperación

```text
Sueño
Fatiga
Recovery Score
```

---

# 27. 🏆 Gamificación

La plataforma tendrá un sistema de logros.

Ejemplos:

### 🥉 Primer entrenamiento

Completar el primer entrenamiento.

### 🧪 Primera evaluación

Registrar el primer 1RM/e1RM.

### 📈 Más fuerte

Aumentar el rendimiento de un ejercicio.

### 🔥 Constancia

Completar 10 entrenamientos.

### 💪 Máquina

Completar 50 entrenamientos.

### 🦾 Nuevo nivel

Aumentar significativamente la fuerza de un ejercicio.

### 👑 Legend

Conseguir progresos destacados en múltiples ejercicios.

---

## Personal Records

```text
🏆 NEW PR

Press banca

Anterior:
105 kg

Nuevo:
110 kg

+5 kg
```

---

# 28. 🌎 Sistema social

En fases futuras la plataforma podrá convertirse en una red social especializada en musculación.

Inspiración:

```text
Strava
```

pero enfocada específicamente en entrenamiento de fuerza e hipertrofia.

---

## Perfil

```text
Nombre
Entrenamientos
PRs
Logros
Rachas
Objetivos
Progreso
```

## Actividades

```text
Lucas completó:

🔥 Push Workout

68 minutos

12.400 kg de volumen
```

Funciones futuras:

```text
❤️ Likes
💬 Comentarios
👥 Seguidores
🏆 Desafíos
```

---

# 29. 📱 Dashboard

El dashboard debe mostrar información útil sin saturar.

Ejemplo:

```text
Hola 👋

🟢 READY

Recovery Score
87 / 100

🔥 Racha
14 días

💪 Fuerza general
+8.4%

🏆 Mejor progreso
Press banca +10 kg

😴 Sueño
7h 42m

🍗 Proteína
142 / 160 g

⚡ Training Efficiency
84 / 100
```

---

## Recomendación del día

```text
🎯 RECOMENDACIÓN

Tu recuperación es buena.

Press banca

82.5 kg

Objetivo:
8–10 reps

RIR:
2

Descanso:
2–3 minutos
```

---

# 30. 🗄️ Modelo de datos

El modelo debe diseñarse pensando en escalabilidad.

## User

```text
id
name
email
createdAt
```

## AthleteProfile

```text
id
userId
birthDate
height
weight
experienceLevel
goal
availableDays
sessionDuration
equipment
createdAt
updatedAt
```

## Exercise

```text
id
name
muscleGroup
secondaryMuscles
equipment
instructions
createdAt
```

## ExerciseRecord

```text
id
userId
exerciseId
weight
repetitions
date
```

## OneRM

```text
id
userId
exerciseId
weight
type
date
source
```

## Workout

```text
id
userId
routineId
date
startTime
endTime
duration
notes
```

## WorkoutExercise

```text
id
workoutId
exerciseId
order
```

## Set

```text
id
workoutExerciseId
setNumber
weight
repetitions
rir
rpe
restSeconds
```

## Routine

```text
id
userId
name
goal
level
methodology
routineType
sourceId
createdAt
updatedAt
```

## RoutineExercise

```text
id
routineId
exerciseId
order
targetSets
targetReps
targetRir
targetPercentage
restSeconds
strategyId
```

---

## NutritionProfile

```text
id
userId
goal
dailyCalories
proteinTarget
carbTarget
fatTarget
```

## Food

```text
id
name
calories
protein
carbohydrates
fat
fiber
servingSize
```

## Meal

```text
id
userId
date
mealType
notes
```

## MealFood

```text
id
mealId
foodId
quantity
```

---

## RecoveryLog

```text
id
userId
date
sleepHours
sleepQuality
energy
stress
soreness
fatigue
motivation
```

---

## ProgressAnalysis

```text
id
userId
exerciseId
status
progressPercentage
confidenceScore
recommendation
createdAt
```

---

## Goal

```text
id
userId
type
exerciseId
currentValue
targetValue
startDate
targetDate
status
```

---

## Achievement

```text
id
name
description
icon
criteria
```

## UserAchievement

```text
id
userId
achievementId
unlockedAt
```

---

# 31. 🏗️ Arquitectura

La aplicación deberá desarrollarse modularmente.

```text
src/

├── components/

├── features/

│   ├── auth/
│   ├── profile/
│   ├── exercises/
│   ├── workouts/
│   ├── routines/
│   ├── oneRM/
│   ├── progress/
│   ├── recovery/
│   ├── nutrition/
│   ├── coach/
│   ├── knowledge/
│   ├── methodologies/
│   ├── achievements/
│   └── social/

├── services/

├── hooks/

├── utils/

├── constants/

├── types/

├── pages/

└── lib/
```

---

# 32. 🧠 Separación de responsabilidades

La aplicación deberá separar:

```text
UI
 ↓
Application Logic
 ↓
Domain Logic
 ↓
Data Access
 ↓
Database
```

Especialmente:

```text
Progress Engine
Nutrition Engine
Recovery Engine
Recommendation Engine
Knowledge Engine
Routine Generator
```

deben ser independientes de React.

Esto permite realizar testing y modificar la interfaz sin romper la lógica de negocio.

---

# 33. 🔐 Seguridad y privacidad

Los datos deportivos y nutricionales son información personal.

El sistema deberá:

* Implementar Row Level Security.
* Proteger los datos privados.
* Separar datos públicos y privados.
* Permitir eliminar la cuenta.
* Permitir eliminar registros.
* Evitar guardar información innecesaria.
* No exponer datos de otros usuarios.
* Aplicar permisos correctamente.

---

# 34. 🎨 UX/UI

La interfaz debe ser:

* Moderna.
* Limpia.
* Rápida.
* Orientada al rendimiento.
* Mobile friendly.
* Visualmente clara.

No debe parecer una planilla de Excel.

Debe utilizar:

```text
Dark mode
Cards
Gráficos
Indicadores
Progreso visual
Animaciones moderadas
Feedback inmediato
```

---

## Registro rápido

El usuario debe poder registrar un entrenamiento rápidamente.

No debe ser obligatorio completar 20 campos.

Los datos avanzados pueden ser opcionales:

```text
RIR
RPE
Descanso
Observaciones
```

---

# 35. 📱 Modos de usuario

## Simple

Pensado para principiantes.

```text
Peso
Repeticiones
Series
Progreso
```

## Advanced

```text
1RM
e1RM
RIR
RPE
Volumen
Tonelaje
Training Efficiency
Recovery Score
Macros
Tendencias
```

---

# 36. 🚀 Roadmap

## FASE 1 — Foundation

```text
Proyecto
Arquitectura
Auth
Base de datos
Perfil
Ejercicios
```

---

## FASE 2 — Training MVP

```text
Crear rutina
Registrar entrenamiento
Registrar series
Peso
Repeticiones
Historial
```

---

## FASE 3 — Strength Engine

```text
1RM
e1RM
Porcentajes
PRs
Historial de fuerza
Gráficos
```

---

## FASE 4 — Progress Engine

```text
Análisis
Detección de progreso
Detección de estancamiento
Confidence Score
Recomendaciones
```

---

## FASE 5 — Adaptive Training

```text
Generador de rutinas
Adaptación al nivel
Adaptación al objetivo
Adaptación al historial
Metodologías
```

---

## FASE 6 — Knowledge Engine

```text
Carga de fuentes
Procesamiento de libros
Extracción de rutinas
Extracción de estrategias
Extracción de principios
Trazabilidad
Validación
```

---

## FASE 7 — Heavy Duty

```text
Rutinas históricas
Evolución metodológica
Estrategias
Pre-exhaustion
HIT
Adaptación por nivel
Historical / Adapted / Custom
```

---

## FASE 8 — Recovery

```text
Sleep
Energy
Stress
Soreness
Fatigue
Recovery Score
```

---

## FASE 9 — Nutrition

```text
Perfil nutricional
Alimentos
Comidas
Calorías
Macros
Análisis
```

---

## FASE 10 — Coach

```text
Athlete State
Recomendaciones
Análisis combinado
Próxima acción
```

---

## FASE 11 — Gamification

```text
Trofeos
Logros
PRs
Rachas
Niveles
Desafíos
```

---

## FASE 12 — Social

```text
Perfil público
Actividades
Seguidores
Likes
Comentarios
Desafíos
```

---

# 37. 🧪 MVP

El MVP debe ser pequeño pero tener una arquitectura preparada para crecer.

## Usuario

```text
Registro
Login
Perfil
Objetivo
Nivel
```

## Entrenamiento

```text
Ejercicios
Rutinas
Series
Repeticiones
Peso
Fecha
Duración
```

## Fuerza

```text
1RM
e1RM
Porcentajes
PR
```

## Análisis

```text
Historial
Gráficos
Progreso
Estancamiento
Recomendaciones básicas
```

## Gamificación

```text
Primer entrenamiento
Primer PR
Racha
```

---

# 38. 📚 Procesamiento de libros y conocimiento

Cuando se incorporen libros de entrenamiento, el sistema deberá procesarlos mediante un pipeline controlado.

```text
PDF
 ↓
Extracción de texto
 ↓
Segmentación
 ↓
Capítulos
 ↓
Secciones
 ↓
Rutinas
 ↓
Ejercicios
 ↓
Estrategias
 ↓
Principios
 ↓
Reglas
 ↓
Validación
 ↓
Knowledge Base
```

Cada dato importante deberá mantener trazabilidad.

Ejemplo:

```text
Strategy:
Pre-exhaustion

Source:
Libro X

Chapter:
Chest Training

Page:
XX

Context:
Descripción original
```

---

# 39. 🔎 Regla de no invención

Esta regla es crítica.

El sistema no debe convertir una interpretación de la IA en un hecho histórico.

Debe distinguir:

```text
DOCUMENTED
```

de:

```text
INTERPRETED
```

y:

```text
ADAPTED
```

Por ejemplo:

```text
Mike Mentzer utilizó X estrategia
```

debe tener una fuente.

Mientras que:

```text
Para este usuario recomendamos adaptar X estrategia
```

es una decisión del sistema.

Nunca deben confundirse.

---

# 40. 🧠 Reglas de inteligencia

La aplicación no debe limitarse a almacenar información.

Cada dato debería tener un propósito.

Ejemplo:

```text
Peso
 ↓
Volumen
 ↓
Rendimiento
 ↓
e1RM
 ↓
Progreso
 ↓
Recomendación
```

Otro:

```text
Sueño
+
Fatiga
+
Rendimiento
 ↓
Recovery Score
 ↓
Athlete State
 ↓
Decisión
```

Otro:

```text
Comida
 ↓
Macros
 ↓
Objetivo nutricional
 ↓
Diferencia
 ↓
Recomendación
```

---

# 41. 🎯 Decision Engine

Entre los motores de análisis y el Coach deberá existir una capa encargada de convertir información en decisiones.

```text
DATOS
 ↓
ANÁLISIS
 ↓
ESTADO
 ↓
DECISION ENGINE
 ↓
ACCIÓN
```

Posibles acciones:

```text
Increase Load
Increase Reps
Maintain Load
Reduce Load
Reduce Volume
Increase Rest
Change Exercise
Repeat Workout
Recovery Day
Deload
New PR Attempt
No PR Attempt
```

La decisión debe estar acompañada por:

```text
Motivo
Confianza
Datos utilizados
```

---

# 42. 🤖 Coach + metodología

El Coach no debe generar una rutina desde cero sin contexto.

Debe consultar:

```text
Athlete State
+
Progress Engine
+
Recovery Engine
+
Nutrition Engine
+
Knowledge Engine
+
Methodology
```

y luego producir:

```text
NEXT ACTION
```

---

# 43. 🧬 Adaptación dinámica

La rutina debe poder evolucionar.

Ejemplo:

```text
Semana 1

60 kg × 8
```

```text
Semana 2

60 kg × 10
```

```text
Semana 3

60 kg × 12
```

```text
Semana 4

65 kg × 8
```

Pero si el atleta muestra:

```text
Fatiga ↑
Sueño ↓
Rendimiento ↓
```

el sistema puede decidir:

```text
No aumentar carga.
```

Esto es entrenamiento adaptativo.

---

# 44. ⚠️ Seguridad

La aplicación nunca deberá:

* Diagnosticar enfermedades.
* Sustituir médicos.
* Sustituir nutricionistas.
* Sustituir entrenadores.
* Incentivar entrenar lesionado.
* Presentar estimaciones como certezas.
* Recomendar cargas peligrosas sin contexto.
* Promover prácticas extremas.

Debe priorizar:

```text
Seguridad
 ↓
Técnica
 ↓
Recuperación
 ↓
Progresión sostenible
```

---

# 45. 👨‍🏫 Entrenador personal

La aplicación debe recomendar explícitamente contar con un entrenador personal cuando corresponda.

Especialmente para:

* Principiantes.
* Aprender técnica.
* Corregir ejecución.
* Aprender nuevos movimientos.
* Trabajar con cargas elevadas.
* Utilizar técnicas avanzadas.
* Evaluar limitaciones de movimiento.

La aplicación es una herramienta de apoyo y seguimiento.

No reemplaza la evaluación presencial de un profesional.

---

# 46. 🧪 Testing

Las reglas de negocio deberán tener tests.

Especialmente:

```text
1RM
e1RM
Progress Engine
Recovery Score
Nutrition Engine
Training Efficiency
Decision Engine
Recommendation Engine
Routine Generator
Knowledge Engine
Adaptation Engine
```

Ejemplo:

```text
Input:
80 kg × 8

Expected:
e1RM ≈ 101.3 kg
```

---

# 47. 🛠️ Stack recomendado

## Frontend

```text
React
TypeScript
Vite
```

## Backend / Database

```text
Supabase
PostgreSQL
```

## Authentication

```text
Supabase Auth
```

## Charts

```text
Recharts
```

## Deploy

```text
Vercel
```

---

# 48. 📁 Arquitectura conceptual

```text
src/

├── features/
│
├── domain/
│   ├── training/
│   ├── strength/
│   ├── recovery/
│   ├── nutrition/
│   ├── progression/
│   ├── methodologies/
│   └── knowledge/
│
├── engines/
│   ├── progress/
│   ├── recovery/
│   ├── nutrition/
│   ├── efficiency/
│   ├── decision/
│   ├── recommendation/
│   ├── adaptation/
│   └── routine/
│
├── infrastructure/
│   ├── database/
│   ├── auth/
│   └── storage/
│
├── components/
├── pages/
├── hooks/
├── services/
├── utils/
├── types/
└── lib/
```

---

# 49. 🏆 PR System

Cada nuevo récord deberá detectarse automáticamente.

Tipos:

```text
1RM PR
e1RM PR
Repetition PR
Volume PR
Workout PR
Consistency PR
```

Ejemplo:

```text
🏆 NEW PERSONAL RECORD

Press Bench

Previous:
105 kg

New:
110 kg

Progress:
+4.76%
```

---

# 50. 🔮 Funcionalidades futuras

## Wearables

Integración futura con:

```text
Apple Watch
Garmin
Fitbit
Wear OS
```

Datos:

```text
Pasos
Frecuencia cardíaca
Sueño
Actividad
```

---

## Fotos de progreso

```text
Fecha
Peso
Foto
```

Permitiendo comparaciones visuales.

---

## IA nutricional

El usuario podrá escribir:

> "Comí dos hamburguesas con papas y una gaseosa."

El sistema generará una estimación:

```text
Calorías:
estimadas

Proteína:
estimada

Carbohidratos:
estimados

Grasas:
estimadas

Confidence:
baja/media/alta
```

---

# 51. 🌎 Visión social

En la etapa final:

```text
GYM PROGRESS INTELLIGENCE

        ↓

PLATAFORMA DE ENTRENAMIENTO

        ↓

COMUNIDAD DEPORTIVA
```

Cada usuario tendrá:

```text
Perfil
Entrenamientos
PRs
Logros
Rachas
Objetivos
Progreso
```

Podrá:

```text
Seguir personas
Compartir entrenamientos
Participar en desafíos
Comparar progreso
Conseguir logros
```

---

# 52. 🧠 Regla de oro del proyecto

La aplicación nunca debería limitarse a almacenar datos.

Cada dato debe tener una finalidad.

```text
DATO
 ↓
MÉTRICA
 ↓
ANÁLISIS
 ↓
INTERPRETACIÓN
 ↓
DECISIÓN
 ↓
ACCIÓN
```

Ejemplo:

```text
80 kg × 10 reps
 ↓
e1RM
 ↓
comparación histórica
 ↓
progreso
 ↓
aumento de carga
 ↓
próxima sesión
```

---

# 53. 🔄 Arquitectura conceptual completa

```text
                         ┌───────────────┐
                         │    USUARIO    │
                         └───────┬───────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ↓                      ↓                      ↓
     🏋️ TRAINING            🍗 NUTRITION           🫀 RECOVERY
          │                      │                      │
          ↓                      ↓                      ↓
      💪 STRENGTH            🔥 ENERGY             😴 SLEEP
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 ↓
                        🧬 ATHLETE STATE
                                 │
                ┌────────────────┼────────────────┐
                ↓                ↓                ↓
          📈 PROGRESS        ⚡ EFFICIENCY    🧪 1RM/e1RM
                │                │                │
                └────────────────┼────────────────┘
                                 ↓
                       🧠 DECISION ENGINE
                                 │
                  ┌──────────────┴──────────────┐
                  ↓                             ↓
          📚 KNOWLEDGE ENGINE             🏋️ HISTORY
                  │
          ┌───────┴────────┐
          ↓                ↓
    METHODOLOGIES      STRATEGIES
          │                │
          └───────┬────────┘
                  ↓
          🧬 ADAPTATION ENGINE
                  │
                  ↓
          🤖 RECOMMENDATION ENGINE
                  │
                  ↓
          🏋️ ROUTINE GENERATOR
                  │
                  ↓
             🎯 NEXT ACTION
                  │
                  ↓
             🏋️ TRAIN
                  │
                  ↓
             📊 NEW DATA
                  │
                  └──────────────→ 🔄
```

---

# 54. 🏁 Visión final

Gym Progress Intelligence no busca ser simplemente:

> "Otra aplicación para anotar pesos."

Busca convertirse en un:

> **Sistema operativo personal para el entrenamiento de musculación.**

El usuario registra:

```text
Qué entrenó
Cuánto levantó
Cuántas repeticiones hizo
Cuánto descansó
Cuánto duró
Cómo se sintió
Cómo durmió
Qué comió
Cuál es su objetivo
```

La aplicación transforma esos datos en:

```text
📈 Progreso
💪 Fuerza
🫀 Recuperación
🍗 Nutrición
⚡ Eficiencia
🧠 Estado del atleta
🤖 Recomendaciones
🏆 Logros
```

Y finalmente responde:

> **¿Qué debería hacer ahora?**

Ese es el verdadero objetivo del proyecto.

---

# 💪 TRAIN

# 📊 MEASURE

# 🧠 ANALYZE

# 🤖 DECIDE

# 📈 PROGRESS

## Gym Progress Intelligence

### Your data. Your training. Your progress.