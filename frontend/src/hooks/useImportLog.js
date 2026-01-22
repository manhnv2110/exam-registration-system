import { importLogService } from "../services/importLogService"

export const useImportLog = () => {

  const importStudentAccounts = async (file) => {
    try {
      const response = await importLogService.importStudentAccounts(file);
      return response;
    } catch (error) {
      throw error
    }
  }

  return { importStudentAccounts }
}