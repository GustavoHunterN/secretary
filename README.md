# TIMELINE: MVP ACTUAL → SISTEMA OPERATIVO PERSONAL

## ESTADO ACTUAL (2026-07-13)

```
✅ Backend: FastAPI + MySQL + OCR Google Vision
✅ Frontend: Expo (React Native) con Recibos + Summary
⏳ Rutinas: Pendiente agregar
⏳ UI/Polish: En progreso
```

---

## SEMANA 1: COMPLETAR MVP FINANZAS + RUTINAS

### 1.1 Configurar Google Vision credenciales (2-3 horas)
- [ ] Crear proyecto en Google Cloud
- [ ] Habilitar Cloud Vision API
- [ ] Descargar `service-account-key.json`
- [ ] Configurar en `backend/.env` → `GOOGLE_APPLICATION_CREDENTIALS`
- [ ] Test: subir foto de factura, OCR debe extraer vendor + amount
- [ ] Commit: "feat: setup Google Vision credenciales"

**Resultado:** OCR totalmente funcional (antes solo fallback)

### 1.2 Agregar Rutinas al backend (3-4 horas)
- [ ] Crear modelo `Routine` en SQLAlchemy
  - name, description, created_at, user_id
- [ ] Crear modelo `RoutineCompletion` 
  - routine_id, date, completed, completed_at
- [ ] Endpoints:
  - POST `/routines` (crear)
  - GET `/routines/today` (qué toca hoy)
  - POST `/routines/{id}/complete` (marcar completada)
  - GET `/routines/stats?days=7` (% completadas semana)
- [ ] Test con `curl` o Postman
- [ ] Commit: "feat: rutinas CRUD + stats"

**Resultado:** Backend soporta rutinas completamente

### 1.3 Frontend: agregar tab Rutinas (4-5 horas)
- [ ] Crear `app/(tabs)/routines.tsx`
- [ ] Componentes:
  - Lista de rutinas de hoy (con checkboxes)
  - Formulario agregar rutina nueva
  - Stats: % completadas esta semana
  - Histórico de cumplimiento
- [ ] Conectar con `/routines/today` API
- [ ] Test en Expo Go
- [ ] Commit: "feat: Routines tab en frontend"

**Resultado:** App con 3 tabs: Recibos, Summary, Rutinas

### 1.4 Pulir UI (2-3 horas)
- [ ] Colores consistentes, tipografía clara
- [ ] Responsive (funciona en iPhone + Android)
- [ ] Iconos para cada tab
- [ ] Animaciones suaves (si aplica)
- [ ] Commit: "style: pulir UI MVP"

**Total Semana 1:** 11-15 horas | Resultado: MVP completo + usable

---

## SEMANA 2-3: VALIDACIÓN + EXPANSIÓN

### 2.1 Integración bancaria opcional (3-5 horas)
- [ ] Investigar APIs BROU/Santander
- [ ] Si disponibles: conectar estado de cuenta
- [ ] Si no: implementar importar CSV
- [ ] Parser automático de transacciones
- [ ] Test: 10 transacciones importadas desde banco
- [ ] Commit: "feat: import bancario"

**Resultado:** Finanzas se populan automáticamente desde banco (opcional)

### 2.2 Categorización inteligente (2-3 horas)
- [ ] Machine learning simple: heurísticas basadas en keywords
  - "Mc Donald's" → "comida"
  - "Uber" → "transporte"
  - "Farmacia" → "salud"
- [ ] Backend: endpoint POST `/receipts/categorize` (predice categoría)
- [ ] Frontend: suggestions al cargar recibos
- [ ] Commit: "feat: auto-categorización"

**Resultado:** Recibos categorizados automático (70%+ accuracy)

### 2.3 Reportes básicos (3-4 horas)
- [ ] Dashboard: mes vs mes comparación
- [ ] Gráfico: tendencia de gasto (últimos 3 meses)
- [ ] Tabla: top categorías de gasto
- [ ] PDF export de resumen mensual
- [ ] Commit: "feat: reportes mensuales"

**Resultado:** Análisis visual de dinero (no solo tabla)

### 2.4 Decisiones de inversión (2-3 horas)
- [ ] Modelo: `Decision` en BD
  - asset, amount, hypothesis, confidence (1-10), purchase_date
- [ ] Endpoints:
  - POST `/decisions` (registrar decisión)
  - GET `/decisions/backtest` (qué salió bien/mal)
  - GET `/decisions/hit-rate` (% aciertos)
- [ ] Frontend: formulario registrar inversión con hipótesis
- [ ] Commit: "feat: registro de decisiones + backtesting simple"

**Resultado:** Histórico de decisiones, análisis de aciertos

**Total Semana 2-3:** 10-15 horas | Resultado: Sistema con análisis real

---

## SEMANA 4: MODELO DE TI + PATRONES

### 4.1 Extracción de datos del diary (2-3 horas)
- [ ] Cuando agrega recibo/rutina/decisión → se extrae contexto
  - Horas trabajadas (si lo menciona)
  - Energía/emoción (escala 1-10)
  - Categoría (qué área de vida)
- [ ] Almacenar: `user_insights` table
- [ ] Commit: "feat: extracción de contexto personal"

**Resultado:** Sistema entiende quién eres (no solo números)

### 4.2 Modelo de objetivos (2-3 horas)
- [ ] Tabla `UserObjectives`:
  - patrimonio_target, autonomy_score, skills, health, relationships
  - timeline (1yr, 5yr, 10yr)
- [ ] Dashboard: comparar estado actual vs target
- [ ] Métrica: "progreso hacia objetivos"
- [ ] Commit: "feat: modelo de objetivos"

**Resultado:** Sistema sabe qué querés lograr

### 4.3 Sesgos detectados (2-3 horas)
- [ ] Análisis: "típicamente eres 20% optimista en tech"
  - Hit rate por categoría
  - Overestimation pattern
  - Tendencia de riesgo
- [ ] Dashboard: "tu perfil de decisión"
- [ ] Commit: "feat: análisis de sesgos personales"

**Resultado:** Autoconocimiento basado en datos

### 4.4 Índice de Autonomía (2-3 horas)
- [ ] Métrica central: 0-100
- [ ] Cinco dimensiones:
  - Financiero (patrimonio)
  - Intelectual (skills nuevas)
  - Salud (capacidad física)
  - Social (network)
  - Tiempo (horas libres)
- [ ] Dashboard: score + cambio semana
- [ ] Commit: "feat: autonomy index"

**Resultado:** Una métrica que sintetiza todo

**Total Semana 4:** 8-12 horas | Resultado: Modelo profundo de ti

---

## SEMANA 5-6: CHAT + DIARY INTELIGENTE

### 5.1 Integrar Claude API (2-3 horas)
- [ ] Backend: cliente de Anthropic SDK
- [ ] Nueva tabla: `Conversations` (context window)
- [ ] Endpoint: POST `/chat` (recibe texto, retorna análisis)
- [ ] System prompt: conoce finanzas + rutinas + objetivos
- [ ] Commit: "feat: Claude API integration"

**Resultado:** Chat que conoce tu contexto

### 5.2 Diary inteligente (3-4 horas)
- [ ] Endpoint: POST `/diary` (cuéntame tu día)
- [ ] Claude extrae automático:
  - Horas en X área (IA, MMA, estudio)
  - Dinero gastado
  - Emocional (energía, estrés, claridad)
  - Decisiones tomadas
  - Qué aprendiste
- [ ] Almacenar en BD con fecha
- [ ] Frontend: formulario "cuéntame tu día" con IA response
- [ ] Commit: "feat: diary inteligente"

**Resultado:** Conversación que se aprende de ti

### 5.3 Memoria de conversación (2-3 horas)
- [ ] Embeddings: text-embedding-3-small de OpenAI
- [ ] Detectar evolución de objetivos:
  - "Quiero independencia" → "Quiero escalar" → "Quiero legacy"
- [ ] Conectar conversaciones relacionadas
- [ ] Dashboard: "evolución de mis objetivos"
- [ ] Commit: "feat: memoria semántica"

**Resultado:** Chat recuerda evolución profunda

### 5.4 Sugerencias personalizadas (2-3 horas)
- [ ] Claude analiza:
  - Patrón de gasto vs presupuesto
  - Rutinas no completadas
  - Decisiones con baja confianza
  - Oportunidades obvias
- [ ] Endpoint: GET `/suggestions` (top 3 acciones)
- [ ] Notificación: "considerá X" (1/día)
- [ ] Commit: "feat: sugerencias personalizadas"

**Resultado:** Sistema que sugiere (no solo reporta)

**Total Semana 5-6:** 9-13 horas | Resultado: Chat inteligente + diary

---

## SEMANA 7-8: BACKTESTING + PREDICCIÓN

### 7.1 Backtesting científico (3-4 horas)
- [ ] Para cada decisión: registrar hipótesis + resultado
- [ ] Análisis estadístico:
  - "7 de 10 decisiones ganaron dinero (70% hit rate)"
  - "Promedio ganancia: 12% en 6 meses"
  - "Mejor en tech que inmuebles"
- [ ] Dashboard: "calibración de confianza"
  - "Dijiste 80% confianza → acertaste 75%"
  - "Mejorá calibración: típicamente optimista 15%"
- [ ] Commit: "feat: backtesting científico"

**Resultado:** Sabes dónde aciertas realmente

### 7.2 Motor de causalidad (3-4 horas)
- [ ] No solo correlación: análisis estadístico real
  - "Dormiste poco 9 veces → productividad bajó 8 de 9"
  - "84% confianza de relación"
  - "Nivel de evidencia: MEDIO"
- [ ] Evita conclusiones falsas
- [ ] Dashboard: "relaciones confirmadas vs hipótesis"
- [ ] Commit: "feat: motor de causalidad"

**Resultado:** Diferencia causa vs coincidencia

### 7.3 Simulador financiero (3-4 horas)
- [ ] "¿Qué pasa si...?"
  - Invierto $10k en Tesla ahora
  - Compro propiedad
  - Dejo facultad
- [ ] Usa TUS datos, no promedios
- [ ] Proyecciones: 1yr, 5yr, 10yr
- [ ] Escenarios: optimista, realista, pesimista
- [ ] Dashboard: "posibles futuros"
- [ ] Commit: "feat: simulador financiero"

**Resultado:** Predicciones personalizadas

### 7.4 Laboratorio personal (2-3 horas)
- [ ] Diseñar experimento:
  - "Eliminar Instagram 3 semanas"
  - Medir: concentración, sueño, dinero, emoción
- [ ] Recopilar datos automático
- [ ] Análisis: "si elimino Instagram, trabajo 5h más"
- [ ] Dashboard: "experimentos + resultados"
- [ ] Commit: "feat: laboratorio personal"

**Resultado:** Validar hipótesis con datos propios

**Total Semana 7-8:** 11-15 horas | Resultado: Predicción + validación

---

## SEMANA 9-10: AUTOMATIZACIÓN PYTHON

### 9.1 APScheduler setup (1-2 horas)
- [ ] Crear `scheduler.py`
- [ ] Jobs ejecutándose en background (no bloquean FastAPI)
- [ ] Logging: qué job pasó, cuándo, resultado
- [ ] Commit: "feat: APScheduler setup"

**Resultado:** Tareas automáticas en background

### 9.2 Scraping de noticias (3-4 horas)
- [ ] Configurar News API o RSS feeds
- [ ] Job cada 6 horas: obtener últimas noticias
- [ ] Filtrar por keywords de inversiones (Tesla, USD, Bitcoin, etc)
- [ ] Guardar en BD: noticia + relevancia score
- [ ] Frontend: mostrar últimas 10 noticias relevantes
- [ ] Commit: "feat: scraping de noticias"

**Resultado:** Noticias de inversión automáticas

### 9.3 Alertas inteligentes (3-4 horas)
- [ ] Job cada 2 horas: chequear precios
- [ ] Si precio baja >5% → enviar email/Telegram
- [ ] Si precio sube >10% → alerta de oportunidad
- [ ] Configuración: qué inversiones monitorear
- [ ] Template profesional de email
- [ ] Commit: "feat: alertas de precios"

**Resultado:** Notificaciones reales en tiempo real

### 9.4 Notificaciones unificadas (2-3 horas)
- [ ] Email + Telegram (user elige preferencia)
- [ ] Una notificación al día (la más importante)
- [ ] Tipos:
  - Precio cambió ⚠️
  - Nueva oportunidad 🎯
  - Alerta de patrón 🔥
  - Sugerencia 💡
  - Rutina sin completar 📌
- [ ] Commit: "feat: notificaciones unificadas"

**Resultado:** No spam, solo lo importante

### 9.5 Insights diarios automáticos (2-3 horas)
- [ ] Job 20:00 cada noche: generar resumen
- [ ] Claude analiza:
  - Horas trabajadas en cada área
  - Dinero gastado/invertido
  - Rutinas completadas
  - Emocional
- [ ] Enviar por email/Telegram
- [ ] Commit: "feat: insights diarios"

**Resultado:** Resumen automático cada noche

**Total Semana 9-10:** 11-16 horas | Resultado: Sistema 24/7 activo

---

## SEMANA 11-12: MOTOR DE CAUSALIDAD + PREDICCIÓN AVANZADA

### 11.1 Análisis de causalidad riguroso (3-4 horas)
- [ ] Regresiones simples: relación entre variables
- [ ] Nivel de confianza: bajo/medio/alto
- [ ] Evita correlaciones falsas
- [ ] Dashboard: "qué relaciones son REALES"
- [ ] Commit: "feat: causalidad rigurosa"

**Resultado:** Decisiones basadas en ciencia, no intuición

### 11.2 Predicciones personalizadas (3-4 horas)
- [ ] "En 2 semanas vas a estar tenso" (basado en patrón)
- [ ] "70% chance de que inversión X sea buena"
- [ ] "Si mantienes patrón, en 1 año patrimonio = $X"
- [ ] "Mejor momento para comprar: agosto" (seasonality)
- [ ] Commit: "feat: predicciones personalizadas"

**Resultado:** Anticipa el futuro

### 11.3 Gemelo digital temprano (3-4 horas)
- [ ] Con 3+ meses de datos
- [ ] "¿Qué habría hecho mi yo de hace 2 meses?"
- [ ] "¿Cómo habría decidido mi versión disciplinada?"
- [ ] Ayuda a contrastar tus decisiones
- [ ] Commit: "feat: gemelo digital"

**Resultado:** Consulta alternativas de ti mismo

**Total Semana 11-12:** 9-12 horas | Resultado: Inteligencia predictiva

---

## SEMANA 13-14: SISTEMA OPERATIVO PERSONAL ⭐

### 13.1 Integración con Google Calendar (2-3 horas)
- [ ] API de Google Calendar
- [ ] Crear eventos automáticamente:
  - "Hoy tocaba MMA" → agrega bloque en calendario
  - "Estudiar IA" → aparece en tu día
- [ ] Sincronización bidireccional
- [ ] Commit: "feat: Google Calendar integration"

**Resultado:** Calendario inteligente

### 13.2 Integración con Gmail (2-3 horas)
- [ ] API de Gmail
- [ ] Sistema puede enviar emails:
  - Resumen diario
  - Alertas urgentes
  - Reportes mensuales
- [ ] Lectura: si necesita contexto de emails (opcional)
- [ ] Commit: "feat: Gmail integration"

**Resultado:** Email automatizado

### 13.3 Integración con Telegram (2-3 horas)
- [ ] Bot de Telegram personalizado
- [ ] Comandos:
  - `/diary` — cuéntame tu día
  - `/alert` — qué pasó hoy
  - `/invest [monto]` — registrar inversión
  - `/routine [nombre]` — marcar rutina completa
- [ ] Notificaciones bidirecionales
- [ ] Commit: "feat: Telegram bot"

**Resultado:** Sistema accesible desde teléfono

### 13.4 Automatización de tareas (3-4 horas)
- [ ] **Crear tareas automáticas:**
  - Si detecta "tengo que estudiar X", crea task
  - Si día de semana está libre, sugiere bloque de IA
- [ ] **Preparar entorno de trabajo:**
  - Abrir proyecto de IA automático
  - Iniciar temporizador (25 min Pomodoro)
  - Reproducir música de focus
  - Notificación: "entorno listo, listos para trabajar"
- [ ] **Integración con scripts locales:**
  - Ejecutar comandos de bash/python
  - Ej: abrir VS Code en carpeta específica
- [ ] Commit: "feat: sistema operativo personal"

**Resultado:** No solo recomendaciones, EJECUTA acciones

### 13.5 Auditoría personal (2-3 horas)
- [ ] Reporte mensual automático:
  - Patrimonio: cambio, trends
  - Dinero: categorías, overspending
  - Rutinas: % completadas
  - Decisiones: hit rate, lecciones
  - Oportunidades: vistas vs tomadas
  - Autonomía: índice + cambio
- [ ] Recomendaciones accionables
- [ ] Commit: "feat: auditoría personal"

**Resultado:** Reflexión automática cada mes

### 13.6 Release y deployment (2-3 horas)
- [ ] Tests: 80% cobertura
- [ ] Sentry: monitoreo de errores
- [ ] Deploy: servidor production
- [ ] Backup automático de BD
- [ ] Documentación de operación
- [ ] Commit: "release: v1.0 Sistema Operativo Personal"

**Resultado:** Sistema production-ready 24/7

**Total Semana 13-14:** 14-19 horas | **Resultado: SISTEMA OPERATIVO COMPLETO ⭐**

---

## RESUMEN TIMELINE

```
SEMANA    FOCUS                    HORAS    COSTO      HITO
─────────────────────────────────────────────────────────────
1         MVP Finanzas+Rutinas     11-15    $15-20     ✅ App usable
2-3       Validación + Análisis    10-15    $20-30     💡 Smart
4         Modelo de ti             8-12     $30-40     🧠 Te entiende
5-6       Chat + Diary             9-13     $40-60     💬 Conversa
7-8       Backtesting + Predict    11-15    $50-70     🔮 Predice
9-10      Automatización           11-16    $60-80     🤖 24/7 activo
11-12     Causalidad + Gemelo      9-12     $70-90     👥 Tu alter ego
13-14     Sistema Operativo        14-19    $90-100    ⭐ COMPLETO

TOTAL     14 semanas              83-127h  $375-590/sem
COSTO ACUMULADO AÑO 1: $720-1,200
```

---

## COSTO ACUMULADO

```
Semana 1:      $15-20/mes
Semana 2-4:    $20-30/mes
Semana 5-8:    $40-60/mes
Semana 9-12:   $70-90/mes
Semana 13-14:  $90-100/mes

TOTAL AÑO 1:   $720-1,200
```

---

## PRÓXIMO PASO

Estás en: **Semana 1 (MVP casi completo)**

Falta:
1. [ ] Google Vision credenciales
2. [ ] Agregar Rutinas backend + frontend
3. [ ] Pulir UI

Entonces → Semana 2-3 (Validación + Análisis)

