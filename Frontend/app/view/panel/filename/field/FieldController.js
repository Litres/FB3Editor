/**
 * Контроллер поля редактирования имени файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.filename.field.FieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.filename.field',

		onBlur: function ()
		{
			var me = this,
				view = me.getView(),
				val = view.getValue();

			me.setNewValue(val);
		},

		/**
		 * Вызывается при нажатии специальной клавиши.
		 * @param {FBEditor.view.panel.filename.field.Field} field Поле.
		 * @param {Ext.event.Event} e Объект события.
		 */
		onSpecialKey: function (field, e)
		{
			var me = this,
				view = me.getView(),
				val = view.getValue(),
				key = e.getKey();

			if (key === e.ENTER || key === e.ESC)
			{
				val = key === e.ENTER ? val : me.getDisplayValue();
				me.setNewValue(val);
				
				if (val)
				{
					//FBEditor.getEditorManager().getSearch().find(val);
				}
				else
				{
					//FBEditor.getEditorManager().getSearch().removeOverlay();
				}
			}
		},

		onActivate: function ()
		{
			var me = this,
				view = me.getView(),
				val = view.getValue();

			// устанавливаем курсор в конец текста
			view.focus([val.length, val.length]);
		},

		/**
		 * @private
		 * Устанавливает новое имя файла и переключает поле.
		 * @param {String} value Имя файла.
		 */
		setNewValue: function (value)
		{
			var me = this,
				view = me.getView(),
				val = value,
				panel;
			
			panel = Ext.getCmp('panel-filename');
			val = view.isValid() ? val : me.getDisplayValue();
			panel.fireEvent('setName', val);
		},

		/**
		 * @private
		 * Возвращает значение поля отображения имени файла.
		 * @return {String} Значение поля отображения.
		 */
		getDisplayValue: function ()
		{
			return Ext.getCmp('panel-filename').child('panel-filename-display').getValue();
		}
	}
);