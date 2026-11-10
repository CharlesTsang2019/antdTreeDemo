import React, { useState } from 'react';
import {
  Card,
  Steps,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Result,
  Descriptions,
  Divider,
  Alert,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  DollarOutlined,
  LockOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// Utility for Chinese currency uppercase
const digitUppercase = (n: number) => {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * Math.pow(10, index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};

export const StepsFormView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    payAccount: 'ant-design@alipay.com (集团核心资金融通主账户)',
    receiverMode: 'alipay',
    receiverAccount: 'finance@supplier-corp.com',
    receiverName: '杭州数字云商智能科技有限公司',
    amount: 50000,
    remark: '2026年Q4核心软件许可及云服务采购款',
    approver: '曲丽丽 (财务审核总监)',
  });

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep((prev) => prev + 1);
    } catch {
      // validation error
    }
  };

  const prev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    message.loading({ content: '正在加密提交安全转账网关...', key: 'transfer' });
    setTimeout(() => {
      message.success({ content: '转账指令已成功下发至网联结算中枢！', key: 'transfer' });
      setCurrentStep(2);
    }, 800);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header explanation */}
      <Card variant="borderless" className="shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0">
          企业级大额资金划转 · 分步表单 (StepsForm)
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-0">
          基于 Ant Design Pro 分步表单体系，将复杂的长表单按业务阶段拆解，提升数据录入体验与资金安全性。
        </p>
      </Card>

      <Card variant="borderless" className="shadow-sm">
        <div className="py-4 px-2 sm:px-8">
          <Steps
            current={currentStep}
            items={[
              { title: '填写转账信息', description: '账户与金额录入' },
              { title: '确认转账明细', description: '安全密码与审批会签' },
              { title: '完成提交', description: '回执与凭单生成' },
            ]}
          />
        </div>

        <Divider />

        <div className="py-2 max-w-xl mx-auto">
          {/* STEP 1 */}
          {currentStep === 0 && (
            <Form
              form={form}
              layout="vertical"
              initialValues={formData}
              onValuesChange={(_, all) => setFormData((prev) => ({ ...prev, ...all }))}
            >
              <Form.Item
                name="payAccount"
                label="付款账户"
                rules={[{ required: true, message: '请选择付款账户' }]}
              >
                <Select
                  options={[
                    {
                      label: 'ant-design@alipay.com (集团核心资金融通主账户 - 余额: ¥8,420,000)',
                      value: 'ant-design@alipay.com (集团核心资金融通主账户)',
                    },
                    {
                      label: '6222 0212 8899 0019 (工商银行超级网银备用户 - 余额: ¥2,100,000)',
                      value: '6222 0212 8899 0019 (工商银行超级网银备用户)',
                    },
                  ]}
                />
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Form.Item name="receiverMode" label="收款方式" className="sm:col-span-1">
                  <Select
                    options={[
                      { label: '企业支付宝', value: 'alipay' },
                      { label: '银行对公账户', value: 'bank' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name="receiverAccount"
                  label="收款账户"
                  className="sm:col-span-2"
                  rules={[{ required: true, message: '请输入收款账号' }]}
                >
                  <Input placeholder="输入支付宝企业账号或银行卡号" />
                </Form.Item>
              </div>

              <Form.Item
                name="receiverName"
                label="收款人全称"
                rules={[{ required: true, message: '请输入收款人全称' }]}
              >
                <Input placeholder="必须与银行开户许可证完全一致" />
              </Form.Item>

              <Form.Item
                name="amount"
                label="转账金额 (元)"
                rules={[{ required: true, message: '请输入划转金额' }]}
                help={
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    大写金额: {digitUppercase(formData.amount || 0)}
                  </div>
                }
              >
                <InputNumber
                  min={1}
                  max={10000000}
                  className="w-full"
                  prefix={<DollarOutlined />}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as any}
                />
              </Form.Item>

              <Form.Item name="remark" label="转账用途与合同编号">
                <Input.TextArea rows={2} placeholder="填写发票备注或采购合同编号..." />
              </Form.Item>

              <div className="flex justify-end pt-3">
                <Button type="primary" onClick={next}>
                  下一步：核实信息
                </Button>
              </div>
            </Form>
          )}

          {/* STEP 2 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Alert
                message="大额资金转账已开启二级风控防护"
                description="请核对收款方主体信息，确认无误后输入安全口令完成审批流程提交。"
                type="info"
                showIcon
              />

              <Descriptions bordered size="small" column={1} className="my-3">
                <Descriptions.Item label="付款账户">{formData.payAccount}</Descriptions.Item>
                <Descriptions.Item label="收款人全称">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {formData.receiverName}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="收款账户">{formData.receiverAccount}</Descriptions.Item>
                <Descriptions.Item label="划转金额">
                  <span className="font-mono text-base font-bold text-red-600 tabular-nums">
                    ¥ {formData.amount?.toLocaleString()} 元
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="大写金额">
                  <span className="text-blue-600 font-medium">
                    {digitUppercase(formData.amount || 0)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="用途备注">{formData.remark}</Descriptions.Item>
                <Descriptions.Item label="审核主管">{formData.approver}</Descriptions.Item>
              </Descriptions>

              <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg space-y-2">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  安全口令校验 (动态 MFA Token)
                </div>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入 6 位动态口令 (默认演示: 888888)"
                  defaultValue="888888"
                />
              </div>

              <div className="flex justify-between pt-3">
                <Button onClick={prev}>上一步</Button>
                <Button type="primary" onClick={handleFinish}>
                  确认并提交划转
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 2 && (
            <Result
              status="success"
              title="转账审批申请提交成功"
              subTitle="资金已进入结算队列，系统已自动指派 曲丽丽 (财务审核总监) 会签审批，预计 2 小时内完成跨行对账结算。"
              extra={[
                <Button
                  type="primary"
                  key="again"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    form.resetFields();
                    setCurrentStep(0);
                  }}
                >
                  再转一笔
                </Button>,
                <Button
                  key="print"
                  icon={<PrinterOutlined />}
                  onClick={() => message.info('已调取电子银行回单凭单')}
                >
                  打印电子凭单
                </Button>,
              ]}
            >
              <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded text-xs text-gray-500 space-y-1">
                <div>• 单据流水号: TRX-20261109-8821903</div>
                <div>• 扣款时间: 2026-11-09 14:30:00 (自动轧差对账)</div>
                <div>• 智能合规判定: 通过反洗钱 AML-5 级筛查</div>
              </div>
            </Result>
          )}
        </div>
      </Card>
    </div>
  );
};
