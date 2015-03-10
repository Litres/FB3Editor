/**
 * Хранилище списка возможных типов связей с объектами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.LinkStore',
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
				value: 'preceding_edition',
				name: 'Прошлое издание'
			},
			{
				value: 'following_edition',
				name: 'Следующее издание'
			},
			{
				value: 'translated_from',
				name: 'Переведено с издания'
			},
			{
				value: 'translation',
				name: 'Перевод'
			},
			{
				value: 'compilation',
				name: 'Сборник, включающий это произведение'
			},
			{
				value: 'part',
				name: 'Часть, включенная в произведение'
			},
			{
				value: 'appendix',
				name: 'Приложение'
			},
			{
				value: 'appendix_to',
				name: 'Эта книга - приложение к'
			},
			{
				value: 'intersection',
				name: 'Пересекается с'
			},
			{
				value: 'same_subject',
				name: 'Тот же объект'
			},
			{
				value: 'alt_media',
				name: 'Другой носитель'
			},
			{
				value: 'sequel',
				name: 'Продолжение'
			},
			{
				value: 'prequel',
				name: 'Приквел'
			},
			{
				value: 'undef',
				name: 'Не определено'
			}
		]
	}
);