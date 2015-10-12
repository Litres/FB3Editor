/**
 * Контроллер поля Название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.title.TitleController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.publishInfo.title',

		onFocus: function ()
		{
			var me = this,
				view = me.getView(),
				val = view.getValue();

			if (!view.isChanged && !val)
			{
				me.copyTitle();
			}
		},

		onChange: function ()
		{
			var me = this,
				view = me.getView();

			view.isChanged = true;
		},

		/**
		 * Копирует название книги в поле.
		 */
		copyTitle: function ()
		{
			var me = this,
				view = me.getView(),
				title;

			title = Ext.getCmp('panel-filename-field').getValue();
			view.setValue(title);
			Ext.defer(
				function ()
				{
					view.focus(true);
				},
				1
			);
		}
	}
);