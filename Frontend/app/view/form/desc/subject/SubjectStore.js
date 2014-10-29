/**
 * Хранилище списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{
				value: 'accounting',
				name: 'Бухучет, налогообложение, аудит'
			},
			{
				value: 'adv_animal',
				name: 'Природа и Животные'
			},
			{
				value: 'adv_geo',
				name: 'Путешествия и География'
			},
			{
				value: 'adv_history',
				name: 'Исторические приключения'
			},
			{
				value: 'adv_indian',
				name: 'Приключения: Индейцы'
			},
			{
				value: 'adv_maritime',
				name: 'Морские приключения'
			},
			{
				value: 'adv_western',
				name: 'Вестерны'
			},
			{
				value: 'adventure',
				name: 'Приключения: Прочее'
			},
			{
				value: 'antique',
				name: 'Старинная литература: Прочее'
			},
			{
				value: 'antique_ant',
				name: 'Античная литература'
			},
			{
				value: 'antique_east',
				name: 'Древневосточная литература'
			},
			{
				value: 'antique_european',
				name: 'Европейская старинная литература'
			},
			{
				value: 'antique_myths',
				name: 'Мифы. Легенды. Эпос'
			},
			{
				value: 'antique_russian',
				name: 'Древнерусская литература'
			},
			{
				value: 'banking',
				name: 'Банковское дело'
			},
			{
				value: 'child_adv',
				name: 'Детские приключения'
			},
			{
				value: 'child_det',
				name: 'Детские детективы'
			},
			{
				value: 'child_education',
				name: 'Детская образовательная'
			},
			{
				value: 'child_prose',
				name: 'Детская проза'
			},
			{
				value: 'child_sf',
				name: 'Детская фантастика'
			},
			{
				value: 'child_tale',
				name: 'Сказки'
			},
			{
				value: 'child_verse',
				name: 'Детские стихи'
			},
			{
				value: 'children',
				name: 'Детские: Прочее'
			},
			{
				value: 'comp_db',
				name: 'Базы данных'
			},
			{
				value: 'comp_hard',
				name: 'Компьютерное Железо'
			},
			{
				value: 'comp_osnet',
				name: 'ОС и Сети'
			},
			{
				value: 'comp_programming',
				name: 'Программирование'
			},
			{
				value: 'comp_soft',
				name: 'Программы'
			},
			{
				value: 'comp_www',
				name: 'Интернет'
			},
			{
				value: 'computers',
				name: 'Компьютеры и Интернет: Прочее'
			},
			{
				value: 'design',
				name: 'Искусство'
			},
			{
				value: 'det_action',
				name: 'Боевики'
			},
			{
				value: 'det_classic',
				name: 'Классические детективы'
			},
			{
				value: 'det_crime',
				name: 'Криминальные детективы'
			},
			{
				value: 'det_espionage',
				name: 'Шпионские детективы'
			},
			{
				value: 'det_hard',
				name: 'Крутой детектив'
			},
			{
				value: 'det_history',
				name: 'Исторические детективы'
			},
			{
				value: 'det_irony',
				name: 'Иронические детективы'
			},
			{
				value: 'det_maniac',
				name: 'Маньяки'
			},
			{
				value: 'det_police',
				name: 'Полицейские детективы'
			},
			{
				value: 'det_political',
				name: 'Политические детективы'
			},
			{
				value: 'dramaturgy',
				name: 'Драматургия'
			},
			{
				value: 'economics',
				name: 'Экономика'
			},
			{
				value: 'economics_ref',
				name: 'Справочники по экономике'
			},
			{
				value: 'global_economy',
				name: 'Внешнеэкономическая деятельность'
			},
			{
				value: 'home_cooking',
				name: 'Кулинария'
			},
			{
				value: 'home_crafts',
				name: 'Хобби и Ремесла'
			},
			{
				value: 'home_diy',
				name: 'Самоделки'
			},
			{
				value: 'home_entertain',
				name: 'Развлечения'
			},
			{
				value: 'home_garden',
				name: 'Сад и Огород'
			},
			{
				value: 'home_health',
				name: 'Здоровье'
			},
			{
				value: 'home_pets',
				name: 'Домашние животные'
			},
			{
				value: 'home_sex',
				name: 'Эротика и Секс'
			},
			{
				value: 'home_sport',
				name: 'Спорт'
			},
			{
				value: 'humor_anecdote',
				name: 'Анекдоты'
			},
			{
				value: 'humor_prose',
				name: 'Юмористическая проза'
			},
			{
				value: 'humor_verse',
				name: 'Юмористические стихи'
			},
			{
				value: 'industries',
				name: 'Отраслевые издания'
			},
			{
				value: 'job_hunting',
				name: 'Поиск работы, карьера'
			},
			{
				value: 'love_contemporary',
				name: 'Современные любовные романы'
			},
			{
				value: 'love_detective',
				name: 'Остросюжетные любовные романы'
			},
			{
				value: 'love_erotica',
				name: 'Эротика'
			},
			{
				value: 'love_history',
				name: 'Исторические любовные романы'
			},
			{
				value: 'love_sf',
				name: 'Любовная фантастика'
			},
			{
				value: 'love_short',
				name: 'Короткие любовные романы'
			},
			{
				value: 'management',
				name: 'Управление, подбор персонала'
			},
			{
				value: 'marketing',
				name: 'Маркетинг, PR, реклама'
			},
			{
				value: 'nonf_biography',
				name: 'Биографии и Мемуары'
			},
			{
				value: 'nonf_criticism',
				name: 'Критика'
			},
			{
				value: 'nonf_publicism',
				name: 'Публицистика'
			},
			{
				value: 'nonfiction',
				name: 'Документальное: Прочее'
			},
			{
				value: 'org_behavior',
				name: 'Корпоративная культура'
			},
			{
				value: 'paper_work',
				name: 'Делопроизводство'
			},
			{
				value: 'personal_finance',
				name: 'Личные финансы'
			},
			{
				value: 'poetry',
				name: 'Поэзия'
			},
			{
				value: 'popular_business',
				name: 'О бизнесе популярно'
			},
			{
				value: 'prose_classic',
				name: 'Классическая проза'
			},
			{
				value: 'prose_contemporary',
				name: 'Современная проза'
			},
			{
				value: 'prose_counter',
				name: 'Контркультура'
			},
			{
				value: 'prose_history',
				name: 'Историческая проза'
			},
			{
				value: 'prose_military',
				name: 'Военная проза'
			},
			{
				value: 'prose_rus_classic',
				name: 'Русская классика'
			},
			{
				value: 'prose_su_classics',
				name: 'Советская классика'
			},
			{
				value: 'real_estate',
				name: 'Недвижимость'
			},
			{
				value: 'ref_dict',
				name: 'Словари'
			},
			{
				value: 'ref_encyc',
				name: 'Энциклопедии'
			},
			{
				value: 'ref_guide',
				name: 'Путеводители'
			},
			{
				value: 'ref_ref',
				name: 'Справочники'
			},
			{
				value: 'reference',
				name: 'Справочная литература: Прочее'
			},
			{
				value: 'religion',
				name: 'Религия и духовность: Прочее'
			},
			{
				value: 'religion_esoterics',
				name: 'Эзотерика'
			},
			{
				value: 'religion_rel',
				name: 'Религия'
			},
			{
				value: 'religion_self',
				name: 'Самосовершенствование'
			},
			{
				value: 'sci_biology',
				name: 'Биология'
			},
			{
				value: 'sci_chem',
				name: 'Химия'
			},
			{
				value: 'sci_culture',
				name: 'Культурология'
			},
			{
				value: 'sci_history',
				name: 'История'
			},
			{
				value: 'sci_juris',
				name: 'Юриспруденция'
			},
			{
				value: 'sci_linguistic',
				name: 'Языкознание'
			},
			{
				value: 'sci_math',
				name: 'Математика'
			},
			{
				value: 'sci_medicine',
				name: 'Медицина'
			},
			{
				value: 'sci_philosophy',
				name: 'Философия'
			},
			{
				value: 'sci_phys',
				name: 'Физика'
			},
			{
				value: 'sci_politics',
				name: 'Политика'
			},
			{
				value: 'sci_psychology',
				name: 'Психология'
			},
			{
				value: 'sci_religion',
				name: 'Религиоведение'
			},
			{
				value: 'sci_tech',
				name: 'Технические'
			},
			{
				value: 'science',
				name: 'Научно-образовательная: Прочее'
			},
			{
				value: 'sf_action',
				name: 'Боевая фантастика'
			},
			{
				value: 'sf_cyberpunk',
				name: 'Киберпанк'
			},
			{
				value: 'sf_detective',
				name: 'Детективная фантастика'
			},
			{
				value: 'sf_epic',
				name: 'Эпическая фантастика'
			},
			{
				value: 'sf_fantasy',
				name: 'Фэнтези'
			},
			{
				value: 'sf_heroic',
				name: 'Героическая фантастика'
			},
			{
				value: 'sf_history',
				name: 'Альтернативная история'
			},
			{
				value: 'sf_horror',
				name: 'Ужасы и Мистика'
			},
			{
				value: 'sf_humor',
				name: 'Юмористическая фантастика'
			},
			{
				value: 'sf_social',
				name: 'Социально-философская фантастика'
			},
			{
				value: 'sf_space',
				name: 'Космическая фантастика'
			},
			{
				value: 'small_business',
				name: 'Малый бизнес'
			},
			{
				value: 'stock',
				name: 'Ценные бумаги, инвестиции'
			},
			{
				value: 'thriller',
				name: 'Триллеры'
			}
		]
	}
);