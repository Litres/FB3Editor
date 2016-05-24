/**
 * Инпут со значением со своими обработчиками.
 *
 * @author samik3k@gmail.ru <Sokolov Alexander aka Sam3000>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.fields.sizeselect.input.Input',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.fields.sizeselect.input.Controller'
		],
		xtype: 'panel-props-body-editor-fields-sizeselect-input',
		controller: 'panel.main.props.body.editor.fields.sizeselect.input',

		translateText: {
			widthError: 'По шаблону \d+(\.\d+)?(em|ex|%|mm). Например: 1.5em'
		},

		regex: /^\d+(\.\d+)?/,
		listeners: {
			blur: 'onBlur'
		},

		initComponent: function ()
		{
			var me = this;

			me.regexText = me.translateText.widthError;
			me.callParent(arguments);
		},

		/**
		 * Когда присваиваем значение, нам надо единицы измерений отрезать
		 * Соседний селект переключим на эту единицу измерения
		 */		
		setValue: function (val)
		{
			var me = this,
				tmp,
				form;
			
			if (val)
			{
				tmp = val.match(/^(\d+(\.\d+)?)(em|ex|%|mm)?$/);
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

		/**
		 * Когда сабмитим форму, надо отдать в модель комбинированое значение инпута и его селекта
		 */	
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
		},

		/**
		 * Возвращаем форму для инпута
		 */	
		getForm: function ()
		{
			var me = this,
				form;

			form = me.form || me.up('form');
			me.form = form;

			return form;
		}
	}
);