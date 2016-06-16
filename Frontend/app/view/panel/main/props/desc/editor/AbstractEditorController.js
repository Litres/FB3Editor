/**
 * Абстрактный контролер формы редактирования свойств элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.editor.AbstractEditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.desc.editor',

		/**
		 * Вызывается при изменении полей формы.
		 */
		onChange: function ()
		{
			var me = this;

			me.updateElement();
		},

		/**
		 * Обновляет элемент в тексте.
		 */
		updateElement: function ()
		{
			var me = this,
				view = me.getView(),
				values;

			if (!view.isLoad)
			{
				values = view.getValues();

				if (view.isValid())
				{
					view.element.update(values);
				}
			}
		}
	}
);