/**
 * Класс управления скролом для прокручиваемого компонента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.scroll.Scroll',
	{
		/**
		 * @property {Number} Длительность события скрола, после которого выбросится событие об окончании
		 * скролинга (милисекунды).
		 * Если событие скрола выбрасывается в тот момент когда длительность предыдущего еще не закончена, то
		 * событие считается продолжением предыдущего и обновляет длительность заново.
		 */
		duration: 500,

		/**
		 * @private
		 * @property {Number} Время начала скрола.
		 */
		startTime: 0,

		/**
		 * @private
		 * @property {Ext.Component} Прокручиваемый компонент.
		 */
		cmp: null,

		/**
		 * @param {Object|Ext.Component} cfg Конфиг или компонент.
		 * @param {Ext.Component} cfg.cmp Компонент.
		 * @param {Number} cfg.duration Длительность события скрола.
		 */
		constructor: function (cfg)
		{
			var me = this,
				cmp;

			if (cfg.cmp)
			{
				me.cmp = cfg.cmp;
				me.duration = cfg.duration || me.duration;
			}
			else
			{
				me.cmp = cfg;
			}

			cmp = me.cmp;

			// регистрируем событие скролла
			cmp.on(
				{
					scope: me,
					afterRender: function ()
					{
						// регистрируем событие скролла
						this.cmp.body.on(
							{
								scope: this,
								scroll:	this.event
							}
						);
					}
				}
			);
		},

		/**
		 * @private
		 * @event startScroll Событие начала скроллинга
		 * Вызывается при возникновении события скролла.
		 */
		event: function ()
		{
			var me =  this,
				duration = me.duration,
				now = new Date().getTime();

			if (!me.startTime)
			{
				me.cmp.fireEvent('startScroll');
			}

			Ext.defer(me.endScroll, duration, me);
			me.startTime = now;
		},

		/**
		 * @private
		 * @event endScroll Событие окончания скроллинга
		 * Определяет окончание скролинга и выбрасывает событие.
		 */
		endScroll: function ()
		{
			var me =  this,
				duration = me.duration,
				startTime = me.startTime,
				now = new Date().getTime();

			//console.log('scroll', now, startTime, now - startTime);

			if (now - startTime >= duration)
			{
				me.startTime = 0;
				me.cmp.fireEvent('endScroll');
			}
			else
			{
				me.cmp.fireEvent('scroll');
			}
		}
	}
);