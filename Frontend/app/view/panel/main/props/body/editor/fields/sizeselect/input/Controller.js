/**
 * Контроллер инпута со значением.
 *
 * @author samik3k@gmail.ru <Sokolov Alexander aka Sam3000>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.fields.sizeselect.input.Controller',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.main.props.body.editor.fields.sizeselect.input',

		/**
		 * Обработчик новых значений инпута
		 * Отрезаем единицы измерений, переключаем селект на найденый
		 */	
		onBlur: function ()
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				field = form.down('#' + view.getId()),
				fieldValue = field.getValue(),
				tmp;

			if (fieldValue == '')
			{
				form.fireEvent('change');
				return;
			}

			tmp = fieldValue.match(/^(\d+(\.\d+)?)(em|ex|%|mm)?$/);

			if (tmp !== null)
			{
				field.setValue(tmp[1]);

				if (tmp[3])
				{
					form.down('combobox[name=' + field.getName() + '-size]').setValue(tmp[3]);
				}
				else
				{
					form.fireEvent('change');
				}
			}
		}
	}
);