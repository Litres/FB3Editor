/**
 * Хранилище списка возможных типов связей с субьектами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.LinkStore',
	{
		extend: 'Ext.data.Store',
		sorters: [
			{
				property: 'name', direction: 'ASC'
			}
		],
		fields: [
			'value',
		    'name'
		],
		data: [
			{
				value: 'editor',
				name: 'Редактор'
			},
			{
				value: 'illustrator',
				name: 'Иллюстратор'
			},
			{
				value: 'compiler',
				name: 'Составитель'
			},
			{
				value: 'publisher',
				name: 'Публикатор'
			},
			{
				value: 'maker-up',
				name: 'Верстальщик'
			},
			{
				value: 'agent',
				name: 'Агент'
			},
			{
				value: 'adapter',
				name: 'Адаптация'
			},
			{
				value: 'dialogue',
				name: 'Диалоги'
			},
			{
				value: 'conceptor',
				name: 'Концепция'
			},
			{
				value: 'reviewer',
				name: 'Отзыв'
			},
			{
				value: 'introduction',
				name: 'Предисловие'
			},
			{
				value: 'afterword',
				name: 'Послесловие'
			},
			{
				value: 'accompanying',
				name: 'Аккомпаниаторы'
			},
			{
				value: 'quotations',
				name: 'Цитаты'
			},
			{
				value: 'annotator',
				name: 'Аннотация'
			},
			{
				value: 'associated',
				name: 'Связывается с'
			},
			{
				value: 'copyright_holder',
				name: 'Владелец прав'
			},
			{
				value: 'commentator',
				name: 'Комментатор'
			},
			{
				value: 'consultant',
				name: 'Консультант'
			},
			{
				value: 'corrector',
				name: 'Корректор'
			},
			{
				value: 'scientific_advisor',
				name: 'Научный советник'
			},
			{
				value: 'dubious_author',
				name: 'Сомнительный автор'
			},
			{
				value: 'designer',
				name: 'Дизайнер'
			},
			{
				value: 'recipient_of_letters',
				name: 'Получатель писем'
			},
			{
				value: 'sponsor',
				name: 'Спонсор'
			},
			{
				value: 'photographer',
				name: 'Фотограф'
			},
			{
				value: 'narrator',
				name: 'Чтец'
			},
			{
				value: 'rendering',
				name: 'Пересказ'
			},
			{
				value: 'other',
				name: 'Прочее'
			},
			{
				value: 'undef',
				name: 'Не определено'
			}
		]
	}
);