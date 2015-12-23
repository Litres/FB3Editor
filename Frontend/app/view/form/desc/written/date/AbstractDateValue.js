/**
 * Дата.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.written.date.AbstractDateValue',
	{
		extend: 'Ext.form.Date',

		listeners: {
			blur: function ()
			{
				this.onBlurField();
			}
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.written.date.AbstractDateText}
		 */
		fieldDateText: null,

		onBlurField: function ()
		{
			var me = this,
				dateVal = me.getRawValue(),
				textVal,
				field;

			field = me.getFieldDateText();
			textVal = field.getRawValue();

			if (/^[0-9]{4}$/.test(dateVal))
			{
				// приводим год к виду Y-01-01
				me.setValue(dateVal + '-01-01');
				dateVal = me.getRawValue();
			}

			if (!textVal)
			{
				// копируем в текстовую дату
				field.setValue(dateVal);
			}
		},

		/**
		 * Возвращает поле даты текстовое.
		 * @return {FBEditor.view.form.desc.written.date.AbstractDateText}
		 */
		getFieldDateText: function ()
		{
			var me = this,
				field;

			field = me.fieldDateText || me.next();

			return field;
		}
	}
);