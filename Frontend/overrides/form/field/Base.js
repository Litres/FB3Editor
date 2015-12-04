/**
 * Корректировки для Ext.form.field.Base.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.form.field.Base',
	{
		override: 'Ext.form.field.Base',

		// нельзя использовать значение qtip, так как вызывает баг "попрыгун"
		msgTarget: 'title',

		tabIndex: 1,

		/**
		 * @property {Boolean} Нужно ли использвать кливишу Enter как Tab для перехода на следующее поле.
		 */
		keyEnterAsTab: false,

		initComponent: function ()
		{
			var me = this;

			me.callParent();
			me.on('specialkey', me.checkEnterKey, me);
		},

		/**
		 * @protected
		 * Проверяет нажатие на Enter.
		 * @param field
		 * @param e
		 */
		checkEnterKey: function (field, e)
		{
			var me = this,
				focusables,
				last,
				next;

			// перемещаем фокус
			if (e.getKey() === e.ENTER && me.keyEnterAsTab)
			{
				// все достыпные поля формы для установки фокуса
				focusables = Ext.getCmp('form-desc').query('field:focusable');
				last = focusables[focusables.length - 1];

				if (me.getId() === last.getId())
				{
					// перемещаем фокус в начало формы
					next = focusables[0];
				}
				else
				{
					// перемещаем фокус на следующий компонент
					next = me.nextNode(':focusable');
				}

				while (next)
				{
					//console.log('ENTER', next.tabIndex, next.isXType('field'), next);

					if (next.isXType('field') && next.tabIndex)
					{
						// устанавливаем фокус на подходящий компонент
						e.stopEvent();
						next.focus();

						break;
					}
					else if (next.isXType('container'))
					{
						// перемещаем фокус на дочерний компонент
						if (next.down('htmleditor'))
						{
							// устанваливаем фокус для полей htmleditor
							next = next.down('htmleditor');
							next.focus([0, 0], 0);

							break
						}
						else
						{
							next = next.down(':focusable');
						}
					}
					else
					{
						// перемещаем фокус на следующий компонент
						next = next.nextNode(':focusable');
					}
				}
			}
		}
	}
);