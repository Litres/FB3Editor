/**
 * Контроллер поля даты описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.date.DateController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.date',

		/**
		 * @event beforeblur
		 */
		onBlur: function ()
		{
			var me = this,
				view = me.getView(),
				date = view.getValue(),
				dateVal = view.getRawValue(),
				now = new Date();

			// вброс события необходим для совершения необходимых операций до выполнения текущих
			view.fireEvent('beforeblur');

			if (/^[0-9]{4}$/.test(dateVal))
			{
				// приводим год к виду Y-01-01
				view.setValue(dateVal + '-01-01');
			}

			if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/.test(dateVal))
			{
				// приводим к формату Y-m-d

				dateVal = dateVal.split('.');

				// преобразуем год к хххх
				dateVal[2] = now.getFullYear().toString().substr(0, 2) + dateVal[2];

				// месяц от 0 до 11
				dateVal[1]--;

				date = new Date(dateVal[2], dateVal[1], dateVal[0]);

				if (now < date)
				{
					// приводим год к прошлому веку, если указана дата в будущем
					dateVal[2] = date.getFullYear() - 100;
				}

				date = new Date(dateVal[2], dateVal[1], dateVal[0]);
				view.setValue(date);
			}
		}
	}
);