-- Fase 6+7 (fusionadas) - Seed: contenido real extraido de los libros de
-- Mentzer disponibles en books/.
--
-- Todo lo escrito en `description`, `objective` y `context` esta
-- parafraseado por Claude a partir de la lectura de los PDF, nunca copiado
-- literal de los libros (ver CRITICAL_COPYRIGHT_COMPLIANCE). Cada fila cita
-- capitulo/seccion/pagina segun el indice del propio libro.
--
-- Fuentes NO incluidas en este seed:
-- - HEAVY_DUTY_APLICACION_PRACTICA.pdf: es duplicado casi identico de
--   HEAVY_DUTY.pdf (mismo indice, mismo contenido). No se registra aparte
--   para no citar dos veces la misma fuente con distinto nombre.
-- - Mike_mentzer_heavy_duty_nutrition.pdf: es un escaneo de imagenes (sin
--   capa de texto) en ingles. Se registra como fuente para que exista la
--   cita, pero su contenido no se extrae en este seed: hace falta OCR y un
--   dominio de Nutrition Engine (Fase 9) que todavia no existe. Extraerlo
--   ahora seria trabajo especulativo sin donde usarlo.

do $$
declare
  v_source_hd uuid;
  v_source_reloaded uuid;
  v_source_nutrition uuid;
  v_routine_id uuid;
begin

-- =========================================================
-- Fuentes
-- =========================================================
insert into public.knowledge_sources (title, author, era, source_type)
values ('Heavy Duty', 'Mike Mentzer (edicion en espanol supervisada por Roberto Marago)', 'Decada de 1980 - texto clasico de alta intensidad', 'book')
returning id into v_source_hd;

insert into public.knowledge_sources (title, author, era, source_type)
values ('Heavy Duty Reloaded: El Renacer de Mike Mentzer en el Siglo XXI', 'Autor no especificado en la fuente (reinterpretacion moderna de la obra de Mentzer)', '2020s - relectura con estudios cientificos posteriores', 'book')
returning id into v_source_reloaded;

insert into public.knowledge_sources (title, author, era, source_type)
values ('Heavy Duty Nutrition', 'Mike Mentzer', 'Decada de 1980', 'book')
returning id into v_source_nutrition;

-- =========================================================
-- Principios (Heavy Duty Reloaded, cap. 1 "Fundamentos de Heavy Duty:
-- Los 7 principios eternos") - INTERPRETED: son la relectura moderna que
-- hace este libro de las ideas de Mentzer, no una cita textual del propio
-- Mentzer.
-- =========================================================
insert into public.principles (source_id, name, description, provenance, citation) values
(v_source_reloaded, 'Identidad',
 'Un tejido muscular solo responde al tipo de estimulo para el que esta biologicamente preparado (tension mecanica suficiente), no a la motivacion ni al volumen de trabajo acumulado.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 1 de 7'),
(v_source_reloaded, 'Intensidad',
 'El nivel de esfuerzo relativo al maximo posible es, segun esta lectura, el factor central que dispara la adaptacion: llevar la serie cerca o hasta el fallo concentrico importa mas que la cantidad de series.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 2 de 7'),
(v_source_reloaded, 'Duracion',
 'Cada minuto extra de entrenamiento despues de alcanzado el estimulo efectivo no suma: consume capacidad de recuperacion en vez de generar mas adaptacion.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 3 de 7'),
(v_source_reloaded, 'Frecuencia',
 'El criterio para volver a entrenar un musculo no es el calendario sino el grado de recuperacion alcanzado; en las versiones mas exigentes del metodo, un mismo grupo muscular puede entrenarse cada 4 a 7 dias.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 4 de 7'),
(v_source_reloaded, 'Especificidad',
 'El estimulo tiene que corresponder al objetivo buscado: cargas pesadas para fuerza, movimientos basicos multiarticulares con sobrecarga progresiva para masa muscular, en vez de sumar variedad de ejercicios.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 5 de 7'),
(v_source_reloaded, 'Adaptacion',
 'El cuerpo no aumenta masa muscular por si solo: lo hace unicamente cuando percibe que el estimulo recibido representa una amenaza real a su capacidad actual, y requiere descanso y nutricion ademas del estimulo para completar el proceso.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 6 de 7'),
(v_source_reloaded, 'Progresion',
 'Sin un registro objetivo de que se esta levantando mas peso, haciendo mas repeticiones o mejorando el control del movimiento sesion a sesion, no hay forma de distinguir entrenar de progresar.',
 'INTERPRETED', 'Heavy Duty Reloaded, cap. 1, principio 7 de 7');

-- =========================================================
-- Estrategias (Heavy Duty, cap. VI "Alta Intensidad", seccion "Los
-- principios de la alta intensidad") - DOCUMENTED: tecnicas tal como las
-- describe el propio Mentzer, en el orden progresivo que el libro propone
-- (de la menos a la mas intensa). La sobrecarga progresiva (1er principio
-- del libro) no se repite aca como estrategia porque ya esta cubierta por
-- el principio "Progresion" de arriba.
-- =========================================================
insert into public.strategies
  (source_id, name, description, objective, recommended_level, risk, rest_seconds_between_steps, provenance, citation)
values
(v_source_hd, 'Repeticiones forzadas',
 'Al llegar al fallo en una repeticion, un companero de entrenamiento aplica la fuerza minima necesaria para ayudar a completar el movimiento y sostener una o dos repeticiones mas alla del fallo natural.',
 'Superar el punto de fallo cuando la sobrecarga normal ya no genera estimulo nuevo',
 'intermediate', 'medium', null, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 2do principio, pag. ~41'),

(v_source_hd, 'Repeticiones negativas',
 'Un companero levanta el peso por el atleta y este controla activamente la bajada, resistiendo con toda la fuerza posible; el texto recomienda reservarla para el final de la ultima serie, no para un entrenamiento completo de negativas puras.',
 'Aprovechar que el musculo es mas fuerte en la fase excentrica (bajada) que en la concentrica para generar un estimulo mayor',
 'advanced', 'high', null, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 3er principio, pag. ~41-42'),

(v_source_hd, 'Pre-agotamiento',
 'Se hace un ejercicio aislante para el musculo grande objetivo (ej. extension de cuadriceps) seguido, casi sin descanso, por un ejercicio basico multiarticular que involucra al mismo musculo (ej. sentadilla), para que el musculo objetivo llegue fatigado al movimiento compuesto y no lo limite un musculo asistente mas chico.',
 'Evitar que un musculo asistente pequeno (triceps, biceps) falle antes que el musculo grande al que deberia estar ayudando',
 'intermediate', 'low', 0, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 4to principio, pag. ~42-43'),

(v_source_hd, 'Contraccion estatica',
 'Durante una repeticion se hacen tres pausas de 2 a 6 segundos (al inicio, en la mitad y cerca del final del recorrido), contrayendo con fuerza el musculo en cada pausa; se recomienda un minimo de 4 repeticiones completas con este patron antes de aumentar la carga.',
 'Generar tension maxima sostenida en puntos especificos del recorrido del movimiento',
 'advanced', 'medium', null, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 5to principio, pag. ~43'),

(v_source_hd, 'Pausa-descanso',
 'Se carga un peso que permite una unica repeticion maxima, se descansan 10 a 12 segundos, se repite el proceso hasta completar unas 4 repeticiones maximas separadas por esos descansos cortos.',
 'Lograr varias repeticiones de esfuerzo maximo cuando una sola serie continua ya no alcanza para reclutar mas fibra muscular',
 'advanced', 'medium', 11, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 6to principio, pag. ~44'),

(v_source_hd, 'Pausa-descanso con negativas',
 'Aplica la misma logica que la pausa-descanso, pero cada repeticion se da por completa recien despues de controlar activamente la bajada del peso, no solo la subida.',
 'Sumar control de la fase negativa a la pausa-descanso para incrementar aun mas la intensidad',
 'advanced', 'high', 11, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 7mo principio, pag. ~44'),

(v_source_hd, 'Pausa-descanso con contraccion estatica',
 'Combina las dos tecnicas anteriores: pausa-descanso entre repeticiones maximas, y dentro de la fase negativa de cada una se agregan las pausas de contraccion estatica. El propio texto lo describe como el nivel mas alto de todo el sistema de intensidad.',
 'Tope superior de intensidad del sistema, para atletas muy avanzados que ya agotaron los niveles anteriores',
 'advanced', 'high', 11, 'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Los principios de la alta intensidad", 8vo principio, pag. ~44-45');

-- =========================================================
-- Rutinas historicas - Heavy Duty (Mentzer, original), DOCUMENTED
-- =========================================================

-- 1) Rutina de aprendizaje tecnico
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_hd, 'Rutina de aprendizaje tecnico', 'Mike Mentzer', 'Heavy Duty clasico - fase inicial', '1980s',
   'Primeras 2 a 3 semanas para cualquier principiante, antes de entrenar con intensidad real. El objetivo es aprender la tecnica correcta de los ejercicios basicos, no generar estimulo de crecimiento.',
   'Dias alternos, sin llegar al fallo muscular en ninguna serie',
   'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Rutinas sugeridas", pag. ~47')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Sentadilla', 0, 1, '15 a 20', null, null),
(v_routine_id, 'Curl femoral', 1, 1, '15 a 20', null, null),
(v_routine_id, 'Elevacion de talones', 2, 1, '15 a 20', null, null),
(v_routine_id, 'Pullover', 3, 1, '15 a 20', null, null),
(v_routine_id, 'Tiron de polea', 4, 1, '15 a 20', null, null),
(v_routine_id, 'Press de banca', 5, 1, '15 a 20', null, null),
(v_routine_id, 'Press de hombros a la nuca', 6, 1, '15 a 20', null, null),
(v_routine_id, 'Press frances', 7, 1, '15 a 20', null, null),
(v_routine_id, 'Curl de biceps', 8, 1, '15 a 20', null, null),
(v_routine_id, 'Encogimientos abdominales', 9, 1, '15 a 20', null, null);

-- 2) Rutina full body al fallo (fase de acondicionamiento)
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_hd, 'Rutina full body al fallo (fase de acondicionamiento)', 'Mike Mentzer', 'Heavy Duty clasico - fase inicial', '1980s',
   'Para el mismo principiante, una vez superada la fase de aprendizaje tecnico. Ahora cada serie se lleva al maximo esfuerzo posible desde el primer entrenamiento.',
   'Dias alternos (3 veces por semana), rutina completa en no mas de 40 minutos',
   'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Rutinas sugeridas", pag. ~48')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Sentadilla', 0, 1, 'Hasta el fallo', 1, null),
(v_routine_id, 'Pullover', 1, 1, 'Hasta el fallo', 1, null),
(v_routine_id, 'Curl femoral', 2, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Elevacion de talones', 3, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Peso muerto', 4, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Tiron de polea', 5, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Press de banca', 6, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Press a la nuca', 7, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Press frances', 8, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Curl de biceps', 9, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Encogimientos abdominales', 10, 1, 'Hasta el fallo', null, null);

-- 3) Division de dos dias - Rutina A (piernas y espalda)
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_hd, 'Division A/B - Rutina A (piernas y espalda)', 'Mike Mentzer', 'Heavy Duty clasico - division de dos dias', '1980s',
   'Paso siguiente una vez adaptado a la rutina de cuerpo completo. Separa el entrenamiento en dos sesiones (A y B) que se alternan, reduciendo la frecuencia por grupo muscular.',
   'Rutina A y B alternadas en dias no consecutivos, cada una unas 3 veces cada 14 dias',
   'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Rutinas sugeridas", pag. ~50-51')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Sentadilla', 0, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Prensa a 45 o 90 grados', 1, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Curl femoral (de pie o acostado)', 2, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Elevacion de talones de pie', 3, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Dominadas, tiron de polea o remo', 4, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Peso muerto (con rodillas flexionadas)', 5, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Curl con barra o banco Scott', 6, 1, 'Hasta el fallo', null, null);

-- 4) Division de dos dias - Rutina B (pecho, hombros, triceps, abdominales)
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_hd, 'Division A/B - Rutina B (pecho, hombros, triceps, abdominales)', 'Mike Mentzer', 'Heavy Duty clasico - division de dos dias', '1980s',
   'Segunda mitad de la division de dos dias: agrupa pecho, hombros y triceps porque el trabajo de pecho ya involucra a los otros dos de forma indirecta.',
   'Rutina A y B alternadas en dias no consecutivos, cada una unas 3 veces cada 14 dias',
   'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Rutinas sugeridas", pag. ~51')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Press de banca (preferentemente declinado)', 0, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Press de hombros a la nuca', 1, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Fondos en paralelas', 2, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Encogimientos abdominales', 3, 1, 'Hasta el fallo', null, null);

-- 5) Pre-agotamiento - Rutina 1
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_hd, 'Pre-agotamiento full body - Rutina 1', 'Mike Mentzer', 'Heavy Duty clasico - pre-agotamiento', '1980s',
   'Para cuando el atleta llega al nivel de pre-agotamiento dentro de la escala de principios de intensidad, aplicado a todo el cuerpo en dos rutinas separadas que se alternan.',
   'Alternando esta rutina con la Rutina 2 de pre-agotamiento',
   'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Rutinas sugeridas", pag. ~51-52')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Extension de cuadriceps', 0, 1, 'Hasta el fallo', 1, 'Pre-agotamiento'),
(v_routine_id, 'Prensa a 45/90 o Sentadilla', 1, 1, 'Hasta el fallo', 1, 'Pre-agotamiento'),
(v_routine_id, 'Curl de femoral', 2, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Elevacion de talones sentado', 3, 1, 'Hasta el fallo', 2, 'Pre-agotamiento'),
(v_routine_id, 'Elevacion de talones de pie', 4, 1, 'Hasta el fallo', 2, 'Pre-agotamiento'),
(v_routine_id, 'Pullover', 5, 1, 'Hasta el fallo', 3, 'Pre-agotamiento'),
(v_routine_id, 'Tiron de polea o dominadas (agarre cerrado)', 6, 1, 'Hasta el fallo', 3, 'Pre-agotamiento'),
(v_routine_id, 'Remo o peso muerto (alternar)', 7, 1, 'Hasta el fallo', null, null),
(v_routine_id, 'Curl Scott o nautilus', 8, 1, 'Hasta el fallo', 4, 'Pre-agotamiento'),
(v_routine_id, 'Dominadas o tiron supinado, agarre cerrado', 9, 1, 'Hasta el fallo', 4, 'Pre-agotamiento');

-- 6) Pre-agotamiento - Rutina 2
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_hd, 'Pre-agotamiento full body - Rutina 2', 'Mike Mentzer', 'Heavy Duty clasico - pre-agotamiento', '1980s',
   'Segunda mitad del esquema de pre-agotamiento para todo el cuerpo, centrada en pecho, hombros, triceps y abdominales.',
   'Alternando esta rutina con la Rutina 1 de pre-agotamiento',
   'DOCUMENTED', 'Heavy Duty (Mentzer), cap. VI, "Rutinas sugeridas", pag. ~52')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Aperturas con mancuernas o Peck-Deck', 0, 1, 'Hasta el fallo', 1, 'Pre-agotamiento'),
(v_routine_id, 'Press de banca (preferentemente declinado)', 1, 1, 'Hasta el fallo', 1, 'Pre-agotamiento'),
(v_routine_id, 'Laterales con mancuerna o nautilus', 2, 1, 'Hasta el fallo', 2, 'Pre-agotamiento'),
(v_routine_id, 'Press a la nuca (barra, maquina o mancuernas)', 3, 1, 'Hasta el fallo', 2, 'Pre-agotamiento'),
(v_routine_id, 'Extension de triceps (polea o press frances)', 4, 1, 'Hasta el fallo', 3, 'Pre-agotamiento'),
(v_routine_id, 'Fondos en paralelas', 5, 1, 'Hasta el fallo', 3, 'Pre-agotamiento'),
(v_routine_id, 'Encogimientos abdominales', 6, 1, 'Hasta el fallo', 4, 'Pre-agotamiento'),
(v_routine_id, 'Encogimientos abdominales invertidos', 7, 1, 'Hasta el fallo', 4, 'Pre-agotamiento');

-- =========================================================
-- Rutinas historicas - Heavy Duty Reloaded, ADAPTED (adaptacion moderna
-- de la metodologia original a rangos de repeticiones y RIR)
-- =========================================================

-- 7) Nivel 1 - Dia A
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_reloaded, 'Nivel 1 - Principiante (Dia A: tren superior)', 'Adaptacion moderna sobre metodo de Mentzer', 'Heavy Duty Reloaded - Nivel 1', '2020s',
   'Primer anio de entrenamiento. El objetivo es adaptar el sistema nervioso y aprender a llegar al fallo con seguridad, antes de buscar cargas maximas.',
   '3 sesiones por semana alternando Dia A y Dia B (ej. lunes, miercoles, viernes), 2 a 3 minutos de descanso entre ejercicios',
   'ADAPTED', 'Heavy Duty Reloaded, cap. 4 "Planes de entrenamiento siglo XXI", Nivel 1')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Press de banca con mancuernas', 0, 1, '6 a 10', null, null),
(v_routine_id, 'Jalon al pecho', 1, 1, '8 a 12', null, null),
(v_routine_id, 'Elevaciones laterales', 2, 1, '12 a 15', null, null),
(v_routine_id, 'Curl de biceps', 3, 1, '8 a 12', null, null),
(v_routine_id, 'Fondos o pushdowns', 4, 1, '8 a 12', null, null);

-- 8) Nivel 1 - Dia B
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_reloaded, 'Nivel 1 - Principiante (Dia B: tren inferior y core)', 'Adaptacion moderna sobre metodo de Mentzer', 'Heavy Duty Reloaded - Nivel 1', '2020s',
   'Segunda mitad de la division de Nivel 1, mismo objetivo que el Dia A: adaptacion neural y tecnica segura al fallo.',
   '3 sesiones por semana alternando Dia A y Dia B (ej. lunes, miercoles, viernes), 2 a 3 minutos de descanso entre ejercicios',
   'ADAPTED', 'Heavy Duty Reloaded, cap. 4 "Planes de entrenamiento siglo XXI", Nivel 1')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Sentadilla o prensa', 0, 1, '8 a 12', null, null),
(v_routine_id, 'Peso muerto rumano', 1, 1, '8 a 12', null, null),
(v_routine_id, 'Abdominales isometricos (planchas)', 2, 2, '30 a 45 segundos', null, null);

-- 9) Nivel 2 - Dia Push
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_reloaded, 'Nivel 2 - Intermedio (Dia Push)', 'Adaptacion moderna sobre metodo de Mentzer', 'Heavy Duty Reloaded - Nivel 2', '2020s',
   '1 a 3 anios de entrenamiento natural, sin estancamientos graves. Busca progresion mas estructurada y control del fallo por grupo muscular, rotando Push/Pull/Legs.',
   '2 a 3 sesiones por semana rotando Push/Pull/Legs en ciclos semanales variables, con descanso total entre sesiones del mismo grupo',
   'ADAPTED', 'Heavy Duty Reloaded, cap. 4 "Planes de entrenamiento siglo XXI", Nivel 2')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Press inclinado con barra o mancuernas', 0, 1, '6 a 10', null, null),
(v_routine_id, 'Fondos lastrados o paralelas', 1, 1, '8 a 12', null, null),
(v_routine_id, 'Press militar o Arnold press', 2, 1, '6 a 10', null, null),
(v_routine_id, 'Extensiones de triceps o pushdowns', 3, 1, '10 a 15', null, null);

-- 10) Nivel 2 - Dia Pull
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_reloaded, 'Nivel 2 - Intermedio (Dia Pull)', 'Adaptacion moderna sobre metodo de Mentzer', 'Heavy Duty Reloaded - Nivel 2', '2020s',
   'Dia de traccion dentro de la rotacion Push/Pull/Legs de Nivel 2.',
   '2 a 3 sesiones por semana rotando Push/Pull/Legs en ciclos semanales variables, con descanso total entre sesiones del mismo grupo',
   'ADAPTED', 'Heavy Duty Reloaded, cap. 4 "Planes de entrenamiento siglo XXI", Nivel 2')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Dominadas lastradas o jalon', 0, 1, '6 a 10', null, null),
(v_routine_id, 'Remo con barra o mancuerna', 1, 1, '8 a 12', null, null),
(v_routine_id, 'Curl con barra Z', 2, 1, '6 a 10', null, null),
(v_routine_id, 'Curl martillo', 3, 1, '10 a 12', null, null);

-- 11) Nivel 2 - Dia Piernas
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_reloaded, 'Nivel 2 - Intermedio (Dia Piernas)', 'Adaptacion moderna sobre metodo de Mentzer', 'Heavy Duty Reloaded - Nivel 2', '2020s',
   'Dia de piernas dentro de la rotacion Push/Pull/Legs de Nivel 2.',
   '2 a 3 sesiones por semana rotando Push/Pull/Legs en ciclos semanales variables, con descanso total entre sesiones del mismo grupo',
   'ADAPTED', 'Heavy Duty Reloaded, cap. 4 "Planes de entrenamiento siglo XXI", Nivel 2')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Sentadilla o prensa', 0, 1, '6 a 10', null, null),
(v_routine_id, 'Peso muerto rumano', 1, 1, '8 a 12', null, null),
(v_routine_id, 'Zancadas o split squat', 2, 1, '10 a 12', null, null),
(v_routine_id, 'Elevacion de talones (gemelos)', 3, 1, '12 a 15', null, null);

-- 12) Nivel 3 - Avanzado
insert into public.historical_routines
  (source_id, name, author, methodology, era, context, frequency_description, provenance, citation)
values
  (v_source_reloaded, 'Nivel 3 - Avanzado natural (full body, maxima intensidad)', 'Adaptacion moderna sobre metodo de Mentzer', 'Heavy Duty Reloaded - Nivel 3', '2020s',
   'Mas de 3 anios de entrenamiento, buscando maxima eficiencia por unidad de tiempo. El texto senala que el propio Mentzer llego a entrenar cuerpo completo una vez cada 6-7 dias en su etapa final. Sesion completa en unos 60 minutos con maxima intensidad y foco.',
   'Una sola sesion cada 4 a 5 dias, cuerpo completo en un solo entrenamiento',
   'ADAPTED', 'Heavy Duty Reloaded, cap. 4 "Planes de entrenamiento siglo XXI", Nivel 3')
  returning id into v_routine_id;

insert into public.historical_routine_exercises (historical_routine_id, exercise_name, order_index, sets, reps_description, superset_group, technique) values
(v_routine_id, 'Peso muerto', 0, 1, '6 a 8', null, null),
(v_routine_id, 'Press de banca inclinado', 1, 1, '6 a 10', null, null),
(v_routine_id, 'Remo Pendlay', 2, 1, '8 a 10', null, null),
(v_routine_id, 'Press militar sentado', 3, 1, '6 a 8', null, null),
(v_routine_id, 'Sentadilla frontal o hack', 4, 1, '8 a 10', null, null),
(v_routine_id, 'Curl de biceps', 5, 1, '8 a 12', null, null),
(v_routine_id, 'Extension de triceps', 6, 1, '10 a 15', null, null),
(v_routine_id, 'Elevaciones laterales', 7, 1, '12 a 15', null, null),
(v_routine_id, 'Elevacion de talones de pie', 8, 1, '15 a 20', null, null);

end $$;
