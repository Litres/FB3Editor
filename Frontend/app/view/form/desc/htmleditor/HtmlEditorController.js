/**
 * Контроллер редактора html.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.htmleditor.HtmlEditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.htmleditor',

		onPaste: function (data)
		{
			var me = this,
				view = me.getView();

			view.stripTags();
		},

		/**
		 * Вызывается при нажатии на кнопку "Уборка".
		 */
		onAfterFieldCleaner: function ()
		{
			var me = this,
				view = me.getView(),
				val = view.getValue(),
				reg = /^(.{0,49}?)-?\n/igm;

			// объединяем короткие строки менее 49 символов
			val = val.replace(reg, '$1');
			view.setValue(val);
		}
	}
);