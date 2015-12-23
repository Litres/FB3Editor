/**
 * Дата.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.written.date.AbstractDateValue',
	{
		extend: 'FBEditor.view.form.desc.date.Date',

		listeners: {
			blur: function ()
			{
				this.onBlurField();
			}
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.written.date.AbstractDateText} Текстовая дата.
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