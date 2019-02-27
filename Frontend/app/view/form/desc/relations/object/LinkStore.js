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
				value: 'reissue',
				name: 'Переиздание'
			},
			{
				value: 'another_translation',
				name: 'Другой перевод'
			},
			{
				value: 'another_translation_alt_media',
				name: 'Другой перевод на другом носителе'
			},
			{
				value: 'compilation_another_translation',
				name: 'Сборник (другой перевод)'
			},
			{
				value: 'part_another_translation',
				name: 'Часть (другой перевод)'
			},
			{
				value: 'compilation_alt_media',
				name: 'Сборник (другой носитель)'
			},
			{
				value: 'part_alt_media',
				name: 'Часть (другой носитель)'
			},
			{
				value: 'translation_to_other_lang',
				name: 'Перевод на другой язык'
			},
			{
				value: 'undef',
				name: 'Не определено'
			}
		]
	}
);