/**
 * Хранилище списка литературных форм.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.bookClass.BookClassStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{value: '', name: 'Неизвестно'},
			{
				value: 'novel',
				name: 'Роман'
			},
			{
				value: 'story',
				name: 'Повесть'
			},
			{
				value: 'short_story',
				name: 'Рассказ'
			},
			{
				value: 'poem',
				name: 'Стихотворение'
			},
			{
				value: 'essay',
				name: 'Эссе'
			},
			{
				value: 'sketch',
				name: 'Очерк'
			},
			{
				value: 'article',
				name: 'Статья'
			},
			{
				value: 'song',
				name: 'Песня'
			},
			{
				value: 'play',
				name: 'Пьеса'
			},
			{
				value: 'interview',
				name: 'Интервью'
			},
			{
				value: 'monograph',
				name: 'Монография'
			},
			{
				value: 'letters',
				name: 'Переписка'
			},
			{
				value: 'diary',
				name: 'Дневник'
			},
			{
				value: 'speech',
				name: 'Речь'
			},
			{
				value: 'manual',
				name: 'Учебник'
			},
			{
				value: 'reference',
				name: 'Справочник'
			},
			{
				value: 'thesis',
				name: 'Диссертация'
			}
		]
	}
);