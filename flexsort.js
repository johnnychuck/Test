steal(
	"./flex.js",
	function($) {
	
		Flex("Flexsort", {
			defaults : {
				/**
				 * @description 控件的id值，自动生成，不建议修改
				 * @value string
				 * @default "" 
				 */
				id : "",
				
				/**
				 * @description 拖动元素的助手类， 
				 * @value null, clone, original
				 * @default clone
				 */
				helper : "clone",
				
				/**
				 * @description 拖动元素时，鼠标的样式
				 * @value 接受所有鼠标样式 
				 */
				cursor : "pointer",
				
				/**
				 * @description 元素被拖动时依附的DOM层
				 * @value window,parent,body,document及js选择器
				 * @default body 
				 */
				appendTo : "body",
				
				/**
				 * @description 过滤拖动元素，即那些元素应该被拖动
				 * @value js选择器
				 * default "" 
				 */
				dragscope : ".sort_item",
				
				/**
				 * @description 拖动元素的边界，即所允许拖动的范围
				 * @value js选择器 
				 */				
				dragmargin : "",
				
				/**
				 * @descriptioin 拖动开始时触发事件
				 * @value function
				 * @param (event, ui)
				 */
				start : null,
				
				/**
				 * @descriptioin 拖动结束时触发事件
				 * @value function
				 * @param (event, ui)
				 */
				stop : null,
				
				/**
				 * @description 过滤堆放容器元素，即哪些元素将用作堆放容器
				 * @value js选择器
				 */
				dropscope : ".drop_pane",
				
				/**
				 * @description 堆放容器的边界（暂废）
				 * @value js选择器
				 */
				dropmargin : "",
				
				/**
				 * @description 堆放容器中新增孩子时触发
				 * @value function
				 * @param (event, ui) 
				 */
				drop : null,
				
				/**
				 * @description 队列的数据数组
				 * @value []
				 * @default null 
				 */
				data : null
			}
		}, {
			init : function() {
				this._super();
				this._createView();
			},

			
			/**
			 * @description 备份sort中使用要的数据，可以使用reset发放来还原备份的数据（备份的数据值保留一个，或是new，或者调用setdata方法使用的数据）
			 */
			_backUp : function() {
				this.backupdata = $.extend(true, new Array, this.options.data);	
			},
			
			
			/**
			 * @description 设置控件不可用
			 * @author 朱海昇
			 * @date 
			 * @version 1.0 
			 */
			setDisable : function() {
				var self = this;
				var rows = this.element.find("ul");
				$.each(rows, function(index, row) {
					$(row).sortable("disable");
				});
				//处理是否参与按钮
				$(self.element).find(".takepartin").hide();
				
				/*
				//处理自动、手动按钮
				$(this.element).undelegate(".plan_pattern", "click");
				
				//处理额外操作按钮
				$(".operate", this.element).hide();
				$(".dutyoperate", this.element).hide();
				$(this.element).undelegate(".operate_toggle", "click");
				*/
			},
			
			
			/**
			 * @description 设置控件可用
			 * @author 朱海昇
			 * @date 
			 * @version 1.0 
			 */
			setEnable : function() {
				var self = this;
				var rows = this.element.find("ul");
				$.each(rows, function(index, row) {
					$(row).sortable("enable");
				});
				
				//处理是否参与按钮
				$(this.element).find(".takepartin").show();
				
				
				/*
				//绑定手工和自动排班的监听事件
				$(self.element).delegate(".plan_pattern", "click", function(event) {
					$(this).find("p").toggleClass(function() {
						if($(this).hasClass("auto")) {
							$(this).removeClass("auto").text("手动");
							return "manual";
						}else {
							$(this).removeClass("manual").text("自动");
							return "auto";
						}
					});
				});
				
				//监听每个班次下面的额外操作
				$(self.element).delegate(".operate_toggle", "click", function(event) {
					var plantype = gbuilder.getSelectCusload().getPlanType();
					if(plantype == "query") {
						return;
					}
					if($(".operate", self.sorthead).filter(":hidden").length) {
						var dutyByDays = gbuilder.getSelectCusload().getOnDutyByDay();
						var dutys = (dutyByDays && dutyByDays[0]) || [];
						$(".operate", self.element).show();
						$(".dutyoperate", self.element).show(function() {
							var isplaned = false;
							var dutyid = $(this).attr("dutyid");
							$.each(dutys, function(index, duty) {
								if(duty.dutyid == dutyid) {
									isplaned = true;
								}
							});
							isplaned ? $(this).addClass("operate_replan").text("重排") : $(this).addClass("operate_plan").text("插排");
						});
					}else {
						$(".operate", self.element).hide();
						$(".dutyoperate", self.element).hide();
					}
				});
				
				
				//监听插排操作
				$(self.element).delegate(".operate_plan", "click", function(event) {
					var pattern = self.getPatternByRow(this);
					self.dutyOperate(pattern, false);
					
				});
				
				//监听重排操作
				$(self.element).delegate(".operate_replay", "click", function(event) {
					var pattern = self.getPatternByRow(this);
					self.dutyOperate(pattern, false);
				});
				*/
			},

			
			dutyOperate : function(pattern, isReply) {
				if(pattern == "auto") {
					
				}else {
					
				}
				
				gbuilder.getSelectCusload().setPlanType("auto");
				//准备补班的班次id
				var adddutyid = self.addplancombo.controller("combo").getValue();
				//已经排班的班次
				var planedduty = gbuilder.getSelectCusload().getOnDutyByDay();
				//需要补班的班次
				var addduty = null;
				//部门下所有班次
				var dutys = gbuilder.getSelectCusload().getFlexsortData();
				$.each(dutys, function(index, duty) {
					if(duty.dutyid == adddutyid) {
						addduty = duty;
					}
				});
				var dateArray = gbuilder.getSelectCusload().getPlainDatesByParams();
				
				var dutybydays = gbuilder.getSelectCusload().generateEachDaysByDutys(dateArray, new Array(addduty));
				var dayArray = gbuilder.getSelectCusload().workers2EachDays(dutybydays, new Array(addduty), planedduty);
				self.setDatas(dayArray);
			},
			
			
			getPatternByRow : function(el) {
				return $(el).closest("tr").find(".plan_pattern p").attr("class");
			},
			
			/**
			 * @description 还原最近一次备份的数据
			 */
			reset : function() {
				this.setDatas(this.backupdata);
				this.options.data = this.backupdata;
			},
			
			
			/**
			 * @description 保存方法
			 * @author 朱海昇
			 * @date 
			 * @version 1.0 
			 */
			save : function() {
				return this.options.data || [];
			},
			
			
			/**
			 * @description 创建视图
			 * @param null
			 * @return null
			 * @author 朱海昇
			 * @date 2014年7月25日
			 * @version 1.0 
			 */
			_createView : function() {
				var self = this;
				this.element.attr("fldname", this.options.name);
				
				$.View("/ntx/sub1/jingcha/paiban/plugin/flexsort.ejs", {
					//id已经没有再使用
					//id : this.options.id
				}, function(data) {
					self.element.append(data);
					self.cacheTable();
					
					if(self.options.data) {
						self._initDatas(self.options.data);
						self._backUp();
					}
				}, this.options.viewasync);
			},
			
			
			/**
			 * @description 将频繁操作的dom元素对象制作成一张table映射表，减少js操作dom的次数
			 * @author 朱海昇
			 * @date 2014年10月02日 09:16:13
			 * @param null
			 * @return null
			 */
			cacheTable : function(cache) {
				//保存到排序表中表格头的引用
				this.sorthead = this.element.find(".personnel-list-title");
				//保存到排序表中表格内容的引用 
				this.sortbody = this.element.find(".personnel-list-center");
			},
			
			
			/**
			 * @description 刷新数据，只允许适应当前表格结构的数据，就是同个单位的值班数据，班次不能改变
             * @param {Object} datas
			 */
			setDatas : function (data) {
				data = data || this.options.data;
				this.options.data = data;
				//备份数据
				this.backupdata = $.extend(true, new Array, this.options.data);
				this.sortbody.empty();
				
				//创建队列表内容
				this._buildSortGrid(data);
			},
			
			
			/**
			 * @description 初始化数据，将数据显示在生成的表格上
             * @param {Object} datas
			 */
			_initDatas : function(data) {
				this._buildSortGrid(data);
			},
			
			
			/**
			 * @description 创建列表表格头部 
			 */
			_buildSortHead : function(data) {
				var tr = $("<tr></tr>");
				//把当i=0的特例放在for循环外，减少每次判断的次数
				$(tr).append($("<td width='12%;'>班次</td>"));
				$(tr).append($("<td width='5%;'>参与</td>"));
				$(tr).append($("<td width='5%;'>模式</td>"));
				$(tr).append($("<td width='auto'>人员顺序</td>"));
				$(tr).append($("<td width='5%;'>操作</td>"));
				//把生成的表格头append到表格的title中
				this.sorthead.append(tr);
			},
			
			
			/**
			 * @description 创建队列格子
			 * @param {Object} data 创建格子的数据 
			 */
			_buildSortGrid : function(data) {
				var self = this;
				var datatable = this.sortbody;
				//创建一个documentfragment，再这里生成完后一次性append到页面上
				var frag = document.createDocumentFragment();
				
				var sortspan, genderspan, namespan, phonespan, tdhead, tdcheckbox,/* tdpattern, tdoperate,*/ tdcontent, astr, ulstr, listr, currow, trduty;
				var maxCount = -1; //tr中li的最多个数
				//tr 当前行， duty 当前班次
				$.each(data, function(tr, duty){
					//获取当前行的班次名称
					trduty = duty.dutyname;
					
					//获取当前行的dom元素
					currow = $("<tr></tr>");
					currow = document.createElement("tr");
					
					tdhead = document.createElement("td");
					tdhead.align = "center";
					tdhead.width = "12%";
					tdhead.innerHTML = "<strong>" +trduty+"</strong>";
					
					tdcheckbox = document.createElement("td");
					tdcheckbox.className = "takepartin";
					tdcheckbox.align = "center";
					tdcheckbox.width = "5%";
					tdcheckbox.setAttribute("duty", duty.dutyid);
					//TODO 设置一个图片咯
					tdcheckbox.innerHTML =  duty.isshow === "Y" ?  "<input type='checkbox' duty='"+duty.dutyid+"' checked='checked'/>" : "<input type='checkbox' duty='"+duty.dutyid+"'/>";
					
					/*
					//排班模式，手动和自动切换
					tdpattern = document.createElement("td");
					tdpattern.className = "plan_pattern";
					tdpattern.align = "center";
					tdpattern.width = "5%";
					tdpattern.innerHTML = "<p class='auto'>自动</p>";
					*/
					
					tdcontent = document.createElement("td");
					ulstr = document.createElement("ul");
					ulstr.className = "ul_sort";
					tdcontent.appendChild(ulstr);
					
					currow.appendChild(tdhead);
					currow.appendChild(tdcheckbox);
					/*
					currow.appendChild(tdpattern);
					*/
					var liCount = 0, phone, name;
					$.each(duty.onworkers, function(sort, obj){
						if(!obj) throw "obj is undefined.";
						
						phone = "";
						if(obj.policename.split("[").length == 2){
							var temp = obj.policename.split("[")[1];
							phone = temp.substr(0,temp.length-1);
						}
						name = obj.policename.split("[")[0];
						
						listr = document.createElement("li");
						listr.className = "sort_item";
						
						sortspan = document.createElement("span");
						obj.isleave ? sortspan.className = "sort personnel-sort item-leave" : sortspan.className = "sort personnel-sort";
						sortspan.innerHTML = sort + 1;
						
						genderspan = document.createElement("span");
						obj.sexcode == "1" ? genderspan.className = "personnel-gender personnel-male" : genderspan.className = "personnel-gender personnel-female";
						$(genderspan).css({display : "none"});
						
						namespan = document.createElement("span");
						namespan.className = "personnel-name";
						namespan.innerHTML = name.length > 4 ? name.substr(0, 4)+"*" : name;
						
						phonespan = document.createElement("span");
						phonespan.className = "personnel-phone";
						phonespan.innerHTML = phone;
						$(phonespan).css({display : "none"});
						
						astr = document.createElement("a");
						astr.className = "personnel-item item-shape";
						astr.title = "姓名："+name+"\n性别："+(obj.sexcode=="1"?"男":"女")+"\n联系电话："+(phone?phone:"未登记")+"\n值班单位："+(duty.syouname||"未知")+"\n值班班次："+(duty.dutyname||"未知");

						astr.appendChild(sortspan);
						astr.appendChild(genderspan);
						astr.appendChild(namespan);
						astr.appendChild(phonespan);
						
						listr.appendChild(astr);
						
						$(listr)
						.attr("policeid", obj.policeid)
						.data(obj.policeid, obj)
						.gridbean({
							obj : obj
						});
						
						ulstr.appendChild(listr);
						
						liCount=sort;
					});
					
					currow.appendChild(tdcontent);
					
					/*
					//将额外操作append上去
					tdoperate = document.createElement("td");
					tdoperate.className = "dutyoperate";
					tdoperate.setAttribute("dutyid", duty.dutyid);
					currow.appendChild(tdoperate);
					*/
					
					frag.appendChild(currow);
					
					if(maxCount<liCount) maxCount=liCount;
				});
				$(this.sortbody).append(frag);
				
				self._bindEvent();
				self._createSortItem();
			},
			
			
			_bindEvent : function() {
				var self = this;
				if(self.isbinded) {
					return;
				}
				
				//使用delegate优化比bind要快速高效,尽可能少创建事件
				//当双击sort列表中的人员时候，新建一个list控件，展示他所有的请假信息
				$(this.element).delegate("a:first-child:has(.item-leave)", "dblclick", function(event) {
					//获取元素上的id
					var policeid = $(event.target).closest("li").attr("policeid");
					if(!policeid) {
						throw "unable to read attributes of policeid, ensure you have setup this attr toward <li> already.";
						return;
					}
					
					var starttime = $.calendar($("#startdate")).getValue();
					var endtime = $.calendar($("#enddate")).getValue();
					if(!starttime || !endtime) {
						throw "Oop, starttime or endtime is unvariable.";
						return;
					}
					
					//人员请假信息列表框
					var infolist = gbuilder.getSelectCusload().levaeinfo;
					
					//如果存在，则设置参数直接查询
					if(infolist) {
						infolist.setArgs({
							policefk : policeid,
							starttime : starttime,
							endtime : endtime
						});
						infolist.doSearch();
					}else {
						gbuilder.getSelectCusload().levaeinfo = new List($(gbuilder.getSelectCusload().content).find("#leave_info_list"), {
							colmodel : [
					            {display: "姓名", name : "name", width : 80,  align: "center"},
								{display: "警号", name : "code", width : 80,  align: "center"},
								{display: "请假类型", name : "htype", width : 80, align: "center"},
								{display: "开始时间", name : "starttime", width : 150,  align: "center", formatter:function(cellvalue, options, rowobject) { return cellvalue.substr(0, 10);}},
								{display: "结束时间", name : "endtime", width : 150,  align: "center",  formatter:function(cellvalue, options, rowobject) { return cellvalue.substr(0, 10);}},
								{display: "事由及去向", name : "reason", width : 335,  align: "center"},
								{display: "审批状态", name : "status", width : 80,  align: "center"}
							],
							width: 970,
							autowidth : true,
						    showindex : true,
							pagesize:3,
							qkey : "jingcha.paiban.pbcreate.leave.info",
							args : {
								policefk : policeid,
								starttime : starttime,
								endtime : endtime
							},
							title: "人员请假信息",
							height: 180	
						});
					}
					$(gbuilder.getSelectCusload().content).find("#leavedetail").show();
				});
				
				
				/*
				//绑定手工和自动排班的监听事件
				$(self.element).delegate(".plan_pattern", "click", function(event) {
					$(this).find("p").toggleClass(function() {
						if($(this).hasClass("auto")) {
							$(this).removeClass("auto").text("手动");
							return "manual";
						}else {
							$(this).removeClass("manual").text("自动");
							return "auto";
						}
					});
				});
				*/
				
				/*
				//监听每个班次下面的额外操作
				$(self.element).delegate(".operate_toggle", "click", function(event) {
					var plantype = gbuilder.getSelectCusload().getPlanType();
					if(plantype == "query") {
						return;
					}
					
					if($(".operate", self.sorthead).filter(":hidden").length) {
						
						var dutyByDays = gbuilder.getSelectCusload().getOnDutyByDay();
						var dutys = (dutyByDays && dutyByDays[0]) || [];
						
						$(".operate", self.element).show();
						$(".dutyoperate", self.element).show(function() {
							var isplaned = false;
							var dutyid = $(this).attr("dutyid");
							$.each(dutys, function(index, duty) {
								if(duty.dutyid == dutyid) {
									isplaned = true;
								}
							});
							
							isplaned ? $(this).addClass("operate_replan").text("重排") : $(this).addClass("operate_plan").text("插排");
						});
					}else {
						$(".operate", self.element).hide();
						$(".dutyoperate", self.element).hide();
					}
				});
				*/
				
				self.isbinded = true;
			},
			
			
			/**
			 * @description 创建可排序的元素
			 * @param  
			 */
			_createSortItem : function() {
				var self = this;
				//获取每一行（即每个班次）
				var rows = this.element.find("ul");
				//在每个班次上调用sortable，对班次下的人员排序
				$.each(rows, function(index, row) {
					$(row).sortable({
						revert : true,
						tolerance : "poniter",
						containment : "body",
						stop : function(event, ui) {
							self.stop.call(self, event, ui, self);
						},
						receive : function(event, ui) {
							self.over.call(self, event, ui, self);
						}
					}).disableSelection();
				});
			},
			
			
			/**
			 * @description 当拖动停止时候触发，更新调整后的顺序
			 * @param {Object} event
			 * @param {Object} ui
			 * @param {Object} self
			 */
			stop : function(event, ui, self) {
				//sortbean,装载当前循环中的gridbean， sortobj， gridbean.getValue()后的对象， tds，当前需要排序的父节点容器
				var sortbean, sortobj, tds = $(event.target).children();
				$.each(tds, function(sort, obj) {
					sortbean = $(obj).data("controllers").gridbean;
					sortobj = sortbean.getValue();
					$(obj).data(sortobj.policeid).sort = (sort + 1);
					sortobj.sort = (sort + 1);
					$(obj).find(".personnel-sort").text(sort+1);
					sortbean.setValue(sortobj);
				});
				
				this.sortDatas();
			},
			
			
			/**
			 * @description 排序的辅助函数，当拖动某个人员后，对当天的值班人员进行排序
			 */
			sortDatas : function() {
				//需要排序的数据
				var data = this.options.data || [];
				var polices;
				//指定排序规则
				var helper = function(x, y) {
					return x.sort-y.sort;
				};
				//遍历当前值班人员，进行重新排序
				$.each(data, function(seq, duty) {
					polices = duty.onworkers;
					polices.sort(helper);
				});
			}
		});	
		
	});