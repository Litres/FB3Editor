/**
 * Модель ресурса книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.model.resource.Resource',
	{
		extend: 'Ext.data.Model',
		fields: [
			{
				// адрес
				name: 'url',
				type: 'string'
			},
			{
				// полное имя файла
				name: 'name',
				type: 'string'
			},
			{
				// основное имя файла, без пути
				name: 'baseName',
				type: 'string'
			},
			{
				// расширение файла
				name: 'extension',
				type: 'string'
			},
			{
				// дата редактирования файла
				name: 'date',
				type: 'string'
			},
			{
				// размер файла
				name: 'size',
				type: 'string'
			},
			{
				// mime-тип
				name: 'type',
				type: 'string'
			}
		]
	}
);