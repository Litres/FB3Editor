/**
 * Контроллер инпута со значением.
 *
 * @author samik3k@gmail.ru <Sokolov Alexander aka Sam3000>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.sizeselect.Controller',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.main.props.body.editor.sizeselect',

		onBlurInputField: function (args)
		{
			var me = this,
				view = me.getView(),
				form = view.up('form'),
				field = form.down('#' + args.id),
				fieldValue = field.getValue();

			if (fieldValue == '')
			{
				return;
			}

			var tmp = fieldValue.match(/^(\d+(\.\d+)?)(em|ex|%|mm)?$/);

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