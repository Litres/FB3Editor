/**
 * Дата текстом.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.written.date.AbstractDateText',
	{
		extend: 'Ext.form.Text',

		listeners: {
			blur: function ()
			{
				this.onBlur();
			}
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.written.date.AbstractDateValue}
		 */
		fieldDateValue: null,

		onBlur: function ()
		{
			var me = this,
				textVal = me.getValue(),
				dateVal,
				field;

			field = me.getFieldDateValue();
			dateVal = field.getRawValue();

			if (/^[0-9]{4}$/.test(textVal))
			{
				// приводим год к виду Y-01-01
				//me.setValue(textVal + '-01-01');
				textVal = me.getValue();
			}

			if (!dateVal && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(textVal))
			{
				// копируем в нормальную дату, если она пустая
				field.setRawValue(textVal);
			}
		},

		/**
		 * Возвращает поле даты.
		 * @return {FBEditor.view.form.desc.written.date.AbstractDateValue}
		 */
		getFieldDateValue: function ()
		{
			var me = this,
				field;

			field = me.fieldDateValue || me.prev();

			return field;
		}
	}
);