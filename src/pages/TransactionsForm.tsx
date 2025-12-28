/* eslint-disable @typescript-eslint/no-unused-vars */


import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { TransactionType, type CreateTransactionDTO } from "../types/transactions";
import { getCategories } from "../services/categoryService";
import type { Category } from "../types/Category";
import Card from "../components/Card";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import Input from "../components/Input";
import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import Select from "../components/Select";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { createTransaction } from "../services/transactionService";
import { toast } from "react-toastify";


interface FormData {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
};

const initialFormData = {
  description: '',
  amount: 0,
  date: '',
  categoryId: '',
  type: TransactionType.EXPENSE,
};


const TransactionsForm = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [error, setError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [loading,setLoading ] = useState<boolean>(false);

  const formId = useId()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const response = await getCategories();
        console.log("📦 Categorias recebidas da API:", response);
      setCategories(response);
      
    };

    fetchCategories();
    
  }, []);


  const filteredCategories = categories.filter((category) => category.type.toLowerCase() === formData.type.toLowerCase());

  const validadeForm = (): boolean => {
    if (!formData.description.trim() || !formData.amount || !formData.date || !formData.categoryId) {
      setDescriptionError("Descrição obri gatoria");
      setError("Preencha todos os campos")
      return false;
    }

    if (formData.amount <= 0) {
      setError("Ovalor deve ser maior que zero");
      return false;
    }

    setError(null)
    return true;

  };

  const handleTransactionType = (itemType: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type: itemType }))

  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: name === "amount" ? Number(value) : value }))
  }

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading (true);
    setDescriptionError(null);

    try {
      if (!validadeForm()) {
        return;
      }

      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: formData.amount,
        categoryId: formData.categoryId,
        type: formData.type,
        date: `${formData.date}T12:00:00.000Z`,
      };

      await createTransaction(transactionData);
      toast.success("Transação adicionda com sucesso!");
      navigate("/transacoes")
    } catch (err) {
      toast.error("Falha ao adicionar a transação")
    }

      finally{
       setLoading (false)
      }
    console.log("Salvando...");
  };

  const handleCancel = () => {
    navigate("/transacoes")
  }


  return (
    <div className="container-app py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>

        <Card>
          {error && (
            <div className="flex items-center  bg-red-00 border border-red-700 rounded-xl p-4 mb-6 gap-2">
              <AlertCircle className="w-5 h-5 text-red-700" />
              <p className=" text-red-700">{error}</p>
            </div>
          )}



          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex gap-2 flex-col">
              <label htmlFor={formId} >Tipo de Transacão</label>
              < TransactionTypeSelector id={formId}
                value={formData.type}
                onChange={handleTransactionType} />
            </div>

            <Input

              label="Descrição"
              name="description"
              value={formData.description}
              onChange={(e) => {
                handleChange(e)
                setDescriptionError(null);
              }}
              placeholder="Ex: Supermercado, Salario, etc..."
              error={descriptionError || undefined}

            />

            <Input
              label="Valor"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="R$ 0,00"
              icon={<DollarSign className="w-4 h-4" />}
              required
            />

            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4" />}

            />

            <Select label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              icon={<Tag className="w-4 h-4 " />}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))
              ]}
            />

            <div className="flex justify-end space-x-3 mt-2">
              <Button variant="outline" onClick={handleCancel} type="button" disabled={loading}>
                Cancelar
              </Button>
              <Button 
               disabled={loading}
              type="submit"
                variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
              >
                {loading ? (
                    <div className="flex items-center justify-center ">

            <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
          </div>
                  ):(

              
                <Save className="w-4 h-4 mr-2" />
                    )}
                Sarval
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;