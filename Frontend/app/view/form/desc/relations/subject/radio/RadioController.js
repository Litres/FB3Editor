/**
 * Контроллер группы радиобатонов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.radio.RadioController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.link.radio',

		onLoadData:  function (data)
		{
			var me = this,
				view = me.getView();

			//console.log('load', data);
			view.setValue(data);
		},

		/**
		 * Вызывается при изменении значения.
		 * @param {FBEditor.view.form.desc.relations.subject.radio.Radio} radio Радиобатоны.
		 * @param {Object} newVal Новое значение.
		 * @param {Object} oldVal Старое значение.
		 */
		onChange: function (radio, newVal, oldVal)
		{
			var me = this,
				sumPercents = 0,
				listVal,
				val,
				percents,
				percent;

			val = Ext.Object.getValues(newVal)[0];

			//console.log('change', val, Ext.Object.getValues(oldVal)[0], radio);

			if (val === 'other-list')
			{
				listVal = radio.up('form-desc-relations-subject-link').
					down('form-desc-relations-subject-link-list').getValue();

				if (!listVal)
				{
					// если селект пустой, то возвращаем предыдущее значение радиобатанов
					radio.setValue(oldVal);
				}
			}
			else if (val === 'publisher')
			{
				// проценты владения персон
				percents = Ext.getCmp('form-desc-relations-subject').query('[name=relations-subject-percent]');

				Ext.Array.each(
					percents,
				    function (item)
				    {
					    // подсчитываем сумму процентов всех персон
					    sumPercents += item.getValue();
				    }
				);

				if (!sumPercents)
				{
					// если проценты не установлены у других персон, то ставим по умолчанию агенту 100%
					percent = radio.up('form-desc-relations-subject-container-custom').
						down('[name=relations-subject-percent]');
					percent.setValue(100);
				}
			}
		}
	}
);