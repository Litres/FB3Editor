/**
 * Хранилище списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectStore',
	{
		extend: 'Ext.data.TreeStore',
		root: {
			expanded: true,
			children: [
				{
					name: 'Приключения',
					children: [
						{
							value: 'adv_animal', name: 'Природа и Животные (adv_animal)', leaf: true
						},
						{
							value: 'adv_geo', name: 'Путешествия и География (adv_geo)', leaf: true
						},
						{
							value: 'adv_history', name: 'Исторические приключения (adv_history)', leaf: true
						},
						{
							value: 'adv_indian', name: 'Приключения: Индейцы (adv_indian)', leaf: true
						},
						{
							value: 'adv_maritime', name: 'Морские приключения (adv_maritime)', leaf: true
						},
						{
							value: 'adv_western', name: 'Вестерны (adv_western)', leaf: true
						},
						{
							value: 'adventure', name: 'Приключения: Прочее (adventure)', leaf: true
						}
					]
				},
				{
					name: 'Старинная литература',
					children: [
						{
							value: 'antique_ant', name: 'Античная литература (antique_ant)', leaf: true
						},
						{
							value: 'antique_east', name: 'Древневосточная литература (antique_east)', leaf: true
						},
						{
							value: 'antique_european', name: 'Европейская старинная литература (antique_european)', leaf: true
						},
						{
							value: 'antique_myths', name: 'Мифы. Легенды. Эпос (antique_myths)', leaf: true
						},
						{
							value: 'antique_russian', name: 'Древнерусская литература (antique_russian)', leaf: true
						},
						{
							value: 'antique', name: 'Старинная литература: Прочее (antique)', leaf: true
						}
					]
				},
				{
					name: 'Детские',
					children: [
						{
							value: 'child_adv', name: 'Детские приключения (child_adv)', leaf: true
						},
						{
							value: 'child_det', name: 'Детские детективы (child_det)', leaf: true
						},
						{
							value: 'child_education', name: 'Детская образовательная (child_education)', leaf: true
						},
						{
							value: 'child_prose', name: 'Детская проза (child_prose)', leaf: true
						},
						{
							value: 'child_sf', name: 'Детская фантастика (child_sf)', leaf: true
						},
						{
							value: 'child_tale', name: 'Сказки (child_tale)', leaf: true
						},
						{
							value: 'child_verse', name: 'Детские стихи (child_verse)', leaf: true
						},
						{
							value: 'children', name: 'Детские: Прочее (children)', leaf: true
						}
					]				
				},
				{
					name: 'Компьютеры и Интернет',
					children: [
						{
							value: 'comp_db', name: 'Базы данных (comp_db)', leaf: true
						},
						{
							value: 'comp_hard', name: 'Компьютерное Железо (comp_hard)', leaf: true
						},
						{
							value: 'comp_osnet', name: 'ОС и Сети (comp_osnet)', leaf: true
						},
						{
							value: 'comp_programming', name: 'Программирование (comp_programming)', leaf: true
						},
						{
							value: 'comp_soft', name: 'Программы (comp_soft)', leaf: true
						},
						{
							value: 'comp_www', name: 'Интернет (comp_www)', leaf: true
						},
						{
							value: 'computers', name: 'Компьютеры и Интернет: Прочее (computers)', leaf: true
						}
					]
				},
				{
					name: 'Детективы и Боевики',
					children: [
						{
							value: 'det_action', name: 'Боевики (det_action)', leaf: true
						},
						{
							value: 'thriller', name: 'Триллеры (thriller)', leaf: true
						},
						{
							value: 'det_classic', name: 'Классические детективы (det_classic)', leaf: true
						},
						{
							value: 'det_crime', name: 'Криминальные детективы (det_crime)', leaf: true
						},
						{
							value: 'det_espionage', name: 'Шпионские детективы (det_espionage)', leaf: true
						},
						{
							value: 'det_hard', name: 'Крутой детектив (det_hard)', leaf: true
						},
						{
							value: 'det_history', name: 'Исторические детективы (det_history)', leaf: true
						},
						{
							value: 'det_irony', name: 'Иронические детективы (det_irony)', leaf: true
						},
						{
							value: 'det_maniac', name: 'Маньяки (det_maniac)', leaf: true
						},
						{
							value: 'det_police', name: 'Полицейские детективы (det_police)', leaf: true
						},
						{
							value: 'det_political', name: 'Политические детективы (det_political)', leaf: true
						}
					]
				},
				{
					name: 'Дом и Семья',
					children: [
						{
							value: 'home_cooking', name: 'Кулинария (home_cooking)', leaf: true
						},
						{
							value: 'home_crafts', name: 'Хобби и Ремесла (home_crafts)', leaf: true
						},
						{
							value: 'home_diy', name: 'Самоделки (home_diy)', leaf: true
						},
						{
							value: 'home_entertain', name: 'Развлечения (home_entertain)', leaf: true
						},
						{
							value: 'home_garden', name: 'Сад и Огород (home_garden)', leaf: true
						},
						{
							value: 'home_health', name: 'Здоровье (home_health)', leaf: true
						},
						{
							value: 'home_pets', name: 'Домашние животные (home_pets)', leaf: true
						},
						{
							value: 'home_sex', name: 'Эротика и Секс (home_sex)', leaf: true
						},
						{
							value: 'home_sport', name: 'Спорт (home_sport)', leaf: true
						}
					]
				},
				{
					name: 'Юмор',
					children: [
						{
							value: 'humor_anecdote', name: 'Анекдоты (humor_anecdote)', leaf: true
						},
						{
							value: 'humor_prose', name: 'Юмористическая проза (humor_prose)', leaf: true
						},
						{
							value: 'humor_verse', name: 'Юмористические стихи (humor_verse)', leaf: true
						}
					]
				},
				{
					name: 'Любовные романы',
					children: [
						{
							value: 'love_contemporary', name: 'Современные любовные романы (love_contemporary)', leaf: true
						},
						{
							value: 'love_detective', name: 'Остросюжетные любовные романы (love_detective)', leaf: true
						},
						{
							value: 'love_erotica', name: 'Эротика (love_erotica)', leaf: true
						},
						{
							value: 'love_history', name: 'Исторические любовные романы (love_history)', leaf: true
						},
						{
							value: 'love_sf', name: 'Любовная фантастика (love_sf)', leaf: true
						},
						{
							value: 'love_short', name: 'Короткие любовные романы (love_short)', leaf: true
						}
					]
				},
				{
					name: 'Документальное',
					children: [
						{
							value: 'nonf_biography', name: 'Биографии и Мемуары (nonf_biography)', leaf: true
						},
						{
							value: 'nonf_criticism', name: 'Критика (nonf_criticism)', leaf: true
						},
						{
							value: 'nonf_publicism', name: 'Публицистика (nonf_publicism)', leaf: true
						},
						{
							value: 'nonfiction', name: 'Документальное: Прочее (nonfiction)', leaf: true
						}
					]
				},
				{
					name: 'Проза',
					children: [
						{
							value: 'prose_classic', name: 'Классическая проза (prose_classic)', leaf: true
						},
						{
							value: 'prose_contemporary', name: 'Современная проза (prose_contemporary)', leaf: true
						},
						{
							value: 'prose_counter', name: 'Контркультура (prose_counter)', leaf: true
						},
						{
							value: 'prose_history', name: 'Историческая проза (prose_history)', leaf: true
						},
						{
							value: 'prose_military', name: 'Военная проза (prose_military)', leaf: true
						},
						{
							value: 'prose_rus_classic', name: 'Русская классика (prose_rus_classic)', leaf: true
						},
						{
							value: 'prose_su_classics', name: 'Советская классика (prose_su_classics)', leaf: true
						}
					]
				},
				{
					name: 'Справочная литература',
					children: [
						{
							value: 'ref_dict', name: 'Словари (ref_dict)', leaf: true
						},
						{
							value: 'ref_encyc', name: 'Энциклопедии (ref_encyc)', leaf: true
						},
						{
							value: 'ref_guide', name: 'Путеводители (ref_guide)', leaf: true
						},
						{
							value: 'ref_ref', name: 'Справочники (ref_ref)', leaf: true
						},
						{
							value: 'reference', name: 'Справочная литература: Прочее (reference)', leaf: true
						}
					]
				},
				{
					name: 'Религия и Духовность',
					children: [
						{
							value: 'religion', name: 'Религия и духовность: Прочее (religion)', leaf: true
						},
						{
							value: 'religion_esoterics', name: 'Эзотерика (religion_esoterics)', leaf: true
						},
						{
							value: 'religion_rel', name: 'Религия (religion_rel)', leaf: true
						},
						{
							value: 'religion_self', name: 'Самосовершенствование (religion_self)', leaf: true
						}
					]
				},
				{
					name: 'Научно-образовательная',
					children: [
						{
							value: 'sci_biology', name: 'Биология (sci_biology)', leaf: true
						},
						{
							value: 'sci_chem', name: 'Химия (sci_chem)', leaf: true
						},
						{
							value: 'sci_culture', name: 'Культурология (sci_culture)', leaf: true
						},
						{
							value: 'sci_history', name: 'История (sci_history)', leaf: true
						},
						{
							value: 'sci_juris', name: 'Юриспруденция (sci_juris)', leaf: true
						},
						{
							value: 'sci_linguistic', name: 'Языкознание (sci_linguistic)', leaf: true
						},
						{
							value: 'sci_math', name: 'Математика (sci_math)', leaf: true
						},
						{
							value: 'sci_medicine', name: 'Медицина (sci_medicine)', leaf: true
						},
						{
							value: 'sci_philosophy', name: 'Философия (sci_philosophy)', leaf: true
						},
						{
							value: 'sci_phys', name: 'Физика (sci_phys)', leaf: true
						},
						{
							value: 'sci_politics', name: 'Политика (sci_politics)', leaf: true
						},
						{
							value: 'sci_psychology', name: 'Психология (sci_psychology)', leaf: true
						},
						{
							value: 'sci_religion', name: 'Религиоведение (sci_religion)', leaf: true
						},
						{
							value: 'sci_tech', name: 'Технические (sci_tech)', leaf: true
						},
						{
							value: 'science', name: 'Научно-образовательная: Прочее (science)', leaf: true
						}
					]
				},
				{
					name: 'Фантастика и Фэнтези',
					children: [
						{
							value: 'sf_action', name: 'Боевая фантастика (sf_action)', leaf: true
						},
						{
							value: 'sf_cyberpunk', name: 'Киберпанк (sf_cyberpunk)', leaf: true
						},
						{
							value: 'sf_detective', name: 'Детективная фантастика (sf_detective)', leaf: true
						},
						{
							value: 'sf_epic', name: 'Эпическая фантастика (sf_epic)', leaf: true
						},
						{
							value: 'sf_fantasy', name: 'Фэнтези (sf_fantasy)', leaf: true
						},
						{
							value: 'sf_heroic', name: 'Героическая фантастика (sf_heroic)', leaf: true
						},
						{
							value: 'sf_history', name: 'Альтернативная история (sf_history)', leaf: true
						},
						{
							value: 'sf_horror', name: 'Ужасы и Мистика (sf_horror)', leaf: true
						},
						{
							value: 'sf_humor', name: 'Юмористическая фантастика (sf_humor)', leaf: true
						},
						{
							value: 'sf_social', name: 'Социально-философская фантастика (sf_social)', leaf: true
						},
						{
							value: 'sf_space', name: 'Космическая фантастика (sf_space)', leaf: true
						}
					]
				},
				{
					name: 'Поэзия и Драматургия',
					children: [
						{
							value: 'dramaturgy', name: 'Драматургия (dramaturgy)', leaf: true
						},
						{
							value: 'poetry', name: 'Поэзия (poetry)', leaf: true
						},
						{
							value: 'humor_verse', name: 'Юмористические стихи (humor_verse)', leaf: true
						},
						{
							value: 'child_verse', name: 'Детские стихи (child_verse)', leaf: true
						}
					]
				},
				{
					name: 'Экономика и Бизнес',
					children: [
						{
							value: 'accounting', name: 'Бухучет, налогообложение, аудит (accounting)', leaf: true
						},
						{
							value: 'banking', name: 'Банковское дело (banking)', leaf: true
						},
						{
							value: 'design', name: 'Искусство (design)', leaf: true
						},
						{
							value: 'economics', name: 'Экономика (economics)', leaf: true
						},
						{
							value: 'economics_ref', name: 'Справочники по экономике (economics_ref)', leaf: true
						},
						{
							value: 'global_economy', name: 'Внешнеэкономическая деятельность (global_economy)', leaf: true
						},
						{
							value: 'industries', name: 'Отраслевые издания (industries)', leaf: true
						},
						{
							value: 'job_hunting', name: 'Поиск работы, карьера (job_hunting)', leaf: true
						},
						{
							value: 'management', name: 'Управление, подбор персонала (management)', leaf: true
						},
						{
							value: 'marketing', name: 'Маркетинг, PR, реклама (marketing)', leaf: true
						},
						{
							value: 'org_behavior', name: 'Корпоративная культура (org_behavior)', leaf: true
						},
						{
							value: 'paper_work', name: 'Делопроизводство (paper_work)', leaf: true
						},
						{
							value: 'personal_finance', name: 'Личные финансы (personal_finance)', leaf: true
						},
						{
							value: 'small_business', name: 'Малый бизнес (small_business)', leaf: true
						},
						{
							value: 'stock', name: 'Ценные бумаги, инвестиции (stock)', leaf: true
						},
						{
							value: 'real_estate', name: 'Недвижимость (real_estate)', leaf: true
						},
						{
							value: 'popular_business', name: 'О бизнесе популярно (popular_business)', leaf: true
						}
					]
				}
			]
		}
	}
);