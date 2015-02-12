/**
 * Хранилище видов отображения ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.control.selectview.SelectViewStore',
	{
		extend: 'Ext.data.Store',
		fields: ['type', 'name'],
		data : [
			{type: "great", name: "Огромные значки"},
			{type: "large", name: "Крупные значки"},
			{type: "normal", name: "Обычные значки"},
			{type: "small", name: "Мелкие значки"},
			{type: "list", name: "Список"},
			{type: "table", name: "Таблица"}
		]
	}
);