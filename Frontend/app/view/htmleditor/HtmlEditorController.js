/**
 * Контроллер редактора HTML.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.htmleditor.HtmlEditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.view.htmleditor',

		/**
		 * @event inithtmleditor
		 * Вброс события инициализации htmleditor в главный контейнер.
		 * @param {FBEditor.view.htmleditor.HtmlEditor} editor Html-редактор.
		 */
		onInitialize: function (editor)
		{
			Ext.getCmp('main').fireEvent('inithtmleditor', editor);
		},

		onLoadText: function (text)
		{
			var me = this,
				view = me.getView();

			view.setValue(text);
		}
    }
);