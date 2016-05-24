/**
 * Инпут со значением со своими обработчиками.
 *
 * @author samik3k@gmail.ru <Sokolov Alexander aka Sam3000>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.sizeselect.Input',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.sizeselect.Controller'
		],
		xtype: 'panel-props-body-editor-sizeselect-input',
		controller: 'panel.main.props.body.editor.sizeselect',

		translateText: {
			widthError: 'По шаблону \d+(\.\d+)?(em|ex|%|mm). Например: 1.5em'
		},

		regex: /^\d+(\.\d+)?/,
		listeners: {
			blurInputField: 'onBlurInputField',
			blur: function ()
			{
				this.fireEvent('blurInputField', {
					id: this.id
				});
			}
		},

		initComponent: function ()
		{
			var me = this;
			me.regexText = me.translateText.widthError;
			me.callParent(arguments);
		},
		
		setValue: function (val)
		{
			var me = this;
			
			if (val)
			{
				var tmp = val.match(/^(\d+(\.\d+)?)(em|ex|%|mm)?$/),
					form = me.up('form');

				if (tmp !== null)
				{
					arguments[0] = tmp[1];

					if (tmp[3])
					{
						form.down('combobox[name=' + me.getName() + '-size]').setValue(tmp[3]);
					}
				}
				else
				{
					arguments[0] = val;
				}
			}

			me.callParent(arguments);
		},

		getSubmitValue: function ()
		{
			var me = this,
				form = me.up('form'),
				field = form.down('#' + this.id),
				data;

			data = field.getValue();
			if (data == '')
			{
				return '';
			}
			data += form.down('combobox[name=' + field.getName() + '-size]').getValue();

			return data;
		}
	}
);